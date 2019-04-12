import { CircularProgress, Grid, IconButton, Switch, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect } from 'react';
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

export default withRouter((props: Props) => {
  const streamId = props.streamId;
  const stream = useStream(streamId);
  
  useEffect(() => {
    if (stream) return;
    updateStreams(streamId);
  }, [streamId]);
  
  return <EntriesViewer
    entries={stream && stream.items}
    id={streamId}
    history={props.history} />
});

const EntriesViewer = (props: { entries: Entry[], id: string, history: History }) => {
  const styles = useStyles();
  const store = useStore();

  const loading = !props.entries || isUpdating(props.id);
  const suitableEntries = props.entries
    ? props.entries.filter(e => e && e.unread || !store.settings.unreadOnly)
    : [];
  return <div className={styles.root}>
    {loading && <Centre>
      <CircularProgress className={styles.loader} />
    </Centre>}
    <Grid spacing={24} container justify='center' wrap='wrap'>
      {suitableEntries
        .map(e => <Grid item key={e.id} lg={3} md={6} sm={6} xs={12} onClick={() => props.history.push(`/entries/${e.id}`)}>
        <EntryCard entry={e} />
      </Grid>)}
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