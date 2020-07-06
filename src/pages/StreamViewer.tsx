import { Button, CircularProgress, FormControlLabel, IconButton, LinearProgress, makeStyles, Switch } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { updateStreams } from '../actions/stream';
import AppBarButton from '../components/AppBarButton';
import Centre from '../components/Centre';
import FriendlyMessage from '../components/FriendlyMessage';
import StickyHeader from '../components/StickyHeader';
import { isUpdating, useStore } from '../hooks/store';
import { setEntryList } from '../services/store';
import StreamList from '../StreamList';
import { useLocation, useHistory } from 'react-router-dom';

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

export default (props: { id: string }) => {
  const store = useStore();
  const styles = useStyles();
  const location = useLocation();
  const history = useHistory();

  const unreadOnly = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return !params.has('showUnread');
  }, [location.search]);
  const toggleUnreadOnly = useCallback(() => {
    history.replace(`?${unreadOnly ? "showUnread" : ""}`)
  }, [unreadOnly]);

  const loading = isUpdating('stream');
  useEffect(() => {
    setEntryList(unreadOnly, props.id);
  },
    // eslint-disable-next-line
    [unreadOnly, props.id, store.lastUpdate]);

  const [progress, setProgress] = useState(0);

  return <div className={styles.root}>
    {unreadOnly
      && <StickyHeader className={styles.header}>
        <LinearProgress variant='determinate' value={progress * 100} color='secondary' />
      </StickyHeader>}
    {loading && <Centre>
      <CircularProgress className={styles.loader} />
    </Centre>}

    {store.subscriptions.length !== 0
      ? <StreamList onProgressChanged={setProgress} />
      : <FriendlyMessage message="No subscriptions :'( Would you like to add some?">
        <Button variant="contained" href="/subscriptions">
          Add Subscriptions
      </Button>
      </FriendlyMessage>}

    <AppBarButton>
      <IconButton disabled={loading} onClick={() => updateStreams(props.id)}>
        <Refresh />
      </IconButton>
    </AppBarButton>
    <AppBarButton>
      <FormControlLabel
        control={<Switch checked={unreadOnly} onClick={toggleUnreadOnly} />}
        label="Unread" />
    </AppBarButton>
  </div>
}