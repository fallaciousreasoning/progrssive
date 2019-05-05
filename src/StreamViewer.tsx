import { CircularProgress, Grid, IconButton, Switch, FormControlLabel } from '@material-ui/core';
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
import Centre from './Centre';
import { Entry } from './model/entry';
import { History } from 'history';
import { ScrollVisibility } from './ScrollVisibility';
import { setUnread } from './MarkerButton';

const useStyles = makeStyles({
  root: {
  },
  loadingButton: {
    color: 'white !important'
  },
  loader: {
    marginBottom: "10px",
  }
});

type Props = RouteComponentProps<any> & {
  streamId: string;
};

const MarkEntryAsRead = (props: { entry: Entry }) => {
  useEffect(() => {
    if (!props.entry || !props.entry.unread) return;

    setUnread(props.entry, false);
  }, [props.entry && props.entry.id])

  return null;
}

export default withRouter((props: Props) => {
  const streamId = props.streamId;
  const stream = useStream(streamId);

  useEffect(() => {
    if (!streamId || stream && stream.id !== streamId) return;
    updateStreams(streamId);
  }, [streamId]);

  return <EntriesViewer
    entries={stream && stream.items}
    id={streamId}
    history={props.history} />
});

const EntriesViewer = (props: { entries: Entry[], id: string, history: History }) => {
  const store = useStore();
  const styles = useStyles();
  const markScrolledAsRead = store.settings.markScrolledAsRead;

  const loading = !props.entries || isUpdating(props.id);

  // Only recalculate suitable entries if something important changes,
  // not only if we mark articles as read.
  const suitableEntries = useMemo(() => props.entries
    ? props.entries.filter(e => e && e.unread || !store.settings.unreadOnly)
    : [],
  [props.entries && props.entries.length, props.id, store.settings.unreadOnly]);

  return <div className={styles.root}>
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
    <AppBarButton>
      <div>
        {loading
          ? <CircularProgress className={styles.loadingButton} size={24} />
          : <IconButton onClick={() => updateStreams(props.id)}>
            <Refresh />
          </IconButton>}
      </div>
    </AppBarButton>
    <AppBarButton>
      <FormControlLabel
        control={<Switch checked={store.settings.unreadOnly} onClick={() => store.settings.unreadOnly = !store.settings.unreadOnly} />}
        label="Unread Only" />
    </AppBarButton>
  </div>
}