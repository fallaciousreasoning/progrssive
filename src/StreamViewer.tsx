import { CircularProgress, Grid, IconButton, Switch, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import EntryCard from "./EntryCard";
import { useStream } from './hooks/stream';
import { useStore } from './hooks/store';
import AppBarButton from './components/AppBarButton';
import { Refresh } from '@material-ui/icons';
import { updateStreams, updatingStream } from './actions/stream';
import { getStream } from './services/store';
import Centre from './Centre';

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

type Props = RouteComponentProps<any>;

export default withRouter((props: Props) => {
  // We have to manually parse the path, because redux router breaks.
  const prefix = 'stream/';
  const streamId = props.location.pathname.substr(prefix.length + 1);

  const styles = useStyles();
  const store = useStore();
  const stream = getStream(streamId);

  useEffect(() => {
    if (stream) return;
    updateStreams(streamId);
  }, [streamId]);

  const hasContent = stream && stream.items;
  const loading = !hasContent || updatingStream(streamId);

  return <div className={styles.root}>
    {loading && <Centre>
        <CircularProgress className={styles.loader}/>
      </Centre>}
    <Grid spacing={24} container justify='center' wrap='wrap'>
      {hasContent && stream.items.map(e => <Grid item key={e.id} lg={3} md={6} sm={6} xs={12} onClick={() => props.history.push(`/entries/${e.id}`)}>
        <EntryCard entry={e} />
      </Grid>)}
    </Grid>
    <AppBarButton>
      <div>
        {loading
        ? <CircularProgress className={styles.loadingButton} size={24} />
          :<IconButton onClick={() => updateStreams(streamId)}>
            <Refresh />
          </IconButton>}
      </div>
    </AppBarButton>
    <AppBarButton>
      <FormControlLabel
        control={<Switch/>}
        label="Unread Only"/>
    </AppBarButton>
  </div>
});