import { makeStyles, CircularProgress, Grid, IconButton, Switch, FormControlLabel, LinearProgress } from '@material-ui/core';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import EntryCard from "./EntryCard";
import { useStream } from './hooks/stream';
import { useStore, isUpdating } from './hooks/store';
import AppBarButton from './components/AppBarButton';
import { Refresh } from '@material-ui/icons';
import { updateStreams, updateStream } from './actions/stream';
import { getStream } from './services/store';
import Centre from './components/Centre';
import { Entry } from './model/entry';
import { History } from 'history';
import { ScrollVisibility } from './components/ScrollVisibility';
import { setUnread } from './actions/marker';
import StickyHeader from './components/StickyHeader';
import { updateSubscriptions } from './services/subscriptions';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { useScreenSize } from './hooks/screenSize';
import StreamList from './StreamList';

const useStyles = makeStyles({
  root: {
  },
  loadingButton: {
    color: 'white !important'
  },
  loader: {
    marginBottom: "10px",
  },
  header: {
    top: '-10px',
    zIndex: 1000,
    margin: '-10px -10px 10px -10px'
  },
});

type Props = RouteComponentProps<any> & {
  id: string;
  active: boolean;
};

export default withRouter((props: Props) => {
  const streamId = props.id;
  const stream = useStream(streamId);

  useEffect(() => {
    if (!streamId || stream && stream.id !== streamId) return;
    updateSubscriptions();
  }, [streamId]);

  return <EntriesViewer
    entries={stream && stream.items}
    id={streamId}
    history={props.history}
    active={props.active} />
});

const EntriesViewer = (props: { entries: Entry[], id: string, active: boolean, history: History }) => {
  const store = useStore();
  const styles = useStyles(undefined);

  const loading = !props.entries || isUpdating('stream');
  const [entryIdsToKeep, setEntryIdsToKeep] = useState<{ [id: string]: boolean }>({});

  const getSuitableEntries = (keep = {}) => {
    if (!props.entries)
      return [];

    const entries = props.entries
      .filter(e => e && (e.unread || !store.settings.unreadOnly || keep[e.id]));

    entries.sort((a, b) => b.published - a.published);
    return entries;
  }

  // When the current viewed stream changes, reset the entries to keep.
  useEffect(() => {
    setEntryIdsToKeep(getSuitableEntries().reduce((prev, next) => {
      prev[next.id] = true;
      return prev;
    }, {}));
  }, [props.id, store.settings.unreadOnly]);

  // Only recalculate suitable entries if something important changes,
  // not only if we mark articles as read.
  // In addition, make sure we don't hide any entries in the list if we receive
  // new ones.
  const suitableEntries = useMemo(() => getSuitableEntries(entryIdsToKeep),
    [props.entries && props.entries.length,
    props.id,
    store.settings.unreadOnly,
    store.updating[props.id],
      entryIdsToKeep]);

  const unreadCount = useMemo(() => suitableEntries.filter(e => e.unread).length, [props.entries]);
  const readProgress = (1 - unreadCount / suitableEntries.length) * 100;

  return <div className={styles.root}>
    {store.settings.unreadOnly
      && !!suitableEntries.length
      && <StickyHeader className={styles.header}>
        <LinearProgress variant='determinate' value={readProgress} color='secondary' />
      </StickyHeader>}
    {loading && <Centre>
      <CircularProgress className={styles.loader} />
    </Centre>}

    <StreamList entries={suitableEntries} />

    {props.active && <>
      <AppBarButton>
        <IconButton disabled={loading} onClick={() => updateStream(props.id)}>
          <Refresh />
        </IconButton>
      </AppBarButton>
      <AppBarButton>
        <FormControlLabel
          control={<Switch checked={store.settings.unreadOnly} onClick={() => store.settings.unreadOnly = !store.settings.unreadOnly} />}
          label="Unread" />
      </AppBarButton>
    </>}
  </div>
}