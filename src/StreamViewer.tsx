import { CircularProgress, Grid, IconButton, Switch, FormControlLabel, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useMemo } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import EntryCard from "./EntryCard";
import { useStream } from './hooks/stream';
import { useStore, isUpdating } from './hooks/store';
import AppBarButton from './components/AppBarButton';
import { Refresh } from '@material-ui/icons';
import { updateStreams } from './actions/stream';
import { getStream } from './services/store';
import Centre from './components/Centre';
import { Entry } from './model/entry';
import { History } from 'history';
import { ScrollVisibility } from './components/ScrollVisibility';
import { setUnread } from './actions/marker';
import StickyHeader from './components/StickyHeader';

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
  }
});

type Props = RouteComponentProps<any> & {
  id: string;
  active: boolean;
};

const MarkEntryAsRead = (props: { entry: Entry }) => {
  useEffect(() => {
    if (!props.entry || !props.entry.unread) return;

    setUnread(props.entry, false);
  }, [props.entry && props.entry.id])

  return null;
}

export default withRouter((props: Props) => {
  const streamId = props.id;
  const stream = useStream(streamId);

  useEffect(() => {
    if (!streamId || stream && stream.id !== streamId) return;
    updateStreams(streamId);
  }, [streamId]);

  return <EntriesViewer
    entries={stream && stream.items}
    id={streamId}
    history={props.history}
    active={props.active} />
});

const EntriesViewer = (props: { entries: Entry[], id: string, active: boolean, history: History }) => {
  const store = useStore();
  const styles = useStyles();
  const markScrolledAsRead = store.settings.markScrolledAsRead;

  const loading = !props.entries || isUpdating(props.id);

  // Only recalculate suitable entries if something important changes,
  // not only if we mark articles as read.
  const suitableEntries = useMemo(() => props.entries
    ? props.entries.filter(e => e && (e.unread || !store.settings.unreadOnly))
    : [],
    [props.entries && props.entries.length,
    props.id,
    store.settings.unreadOnly,
    store.updating[props.id]]);

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
    <Grid spacing={24} container justify='center' wrap='wrap'>
      {suitableEntries
        .map(e => <ScrollVisibility key={e.id}
          getContainer={n => n.parentElement.parentElement.parentElement}>
          {(visible) => <Grid item lg={3} md={6} sm={6} xs={12} onClick={() => props.history.push(`/entries/${e.id}`)}>
            <EntryCard entry={e} showingUnreadOnly={store.settings.unreadOnly} />
            {!visible && markScrolledAsRead && <MarkEntryAsRead entry={e} />}
          </Grid>}
        </ScrollVisibility>)}
    </Grid>
    {props.active && <>
      <AppBarButton>
        <IconButton disabled={loading} onClick={() => updateStreams(props.id)}>
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