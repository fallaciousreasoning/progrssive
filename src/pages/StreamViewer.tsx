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
import LinkButton from '../components/LinkButton';

const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'hidden auto',
    scrollSnapType: 'y mandatory',
    maxHeight: `calc(100vh - 48px - ${theme.spacing(2)}px)`,
    '&> *': {
      scrollSnapAlign: 'start'
    }
  },
  loadingButton: {
    color: 'white !important'
  },
  loader: {
    marginBottom: theme.spacing(),
  },
  header: {
    top: -theme.spacing(),
    zIndex: 1000,
    margin: `-${theme.spacing(1)}px -${theme.spacing(1)}px ${theme.spacing(1)}px -${theme.spacing(1)}px`
  },
}));

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
      : <FriendlyMessage>
        <LinkButton variant="contained" color="secondary" href="/subscriptions?query=">
          No Subscriptions. Add Some?
      </LinkButton>
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

    <div style={{background: 'red', height: 'calc(100vh - 48px)'}}>
      Foo Bar
    </div>
  </div>
}