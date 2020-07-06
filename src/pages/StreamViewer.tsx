import { Button, CircularProgress, FormControlLabel, IconButton, LinearProgress, makeStyles, Switch, Typography } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
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
import StackPanel from '../components/StackPanel';

const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'hidden auto',
    scrollSnapType: 'y mandatory',
    maxHeight: `calc(100vh - 48px - ${theme.spacing(2)}px)`,
    '&> *': {
      scrollSnapAlign: 'start'
    },
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
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
    margin: `-${theme.spacing(1)}px -${theme.spacing(1)}px ${theme.spacing(1)}px -${theme.spacing(1)}px`,
    scrollSnapAlign: 'none'
  },
  footer: {
    scrollSnapAlign: 'start',
    height: `calc(100vh - 48px - ${theme.spacing(2)}px)`
  },
  footerLoader: {
    marginRight: theme.spacing(1)
  }
}));

export default (props: { id: string }) => {
  const store = useStore();
  const styles = useStyles();
  const location = useLocation();
  const history = useHistory();
  const rootRef = useRef<HTMLDivElement>();
  const scrollToTop = useCallback(() => {
    rootRef.current.scrollTo(0, 0);
  }, [rootRef.current]);

  const unreadOnly = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return !params.has('showUnread');
  }, [location.search]);
  const toggleUnreadOnly = useCallback(() => {
    history.replace(`?${unreadOnly ? "showUnread" : ""}`);
  }, [unreadOnly, store.stream]);

  const loading = isUpdating('stream');
  useEffect(() => {
    setEntryList(unreadOnly, props.id);
  },
    // eslint-disable-next-line
    [unreadOnly, props.id, store.lastUpdate]);

  const [progress, setProgress] = useState(0);

  return <div ref={rootRef} className={styles.root}>
    {unreadOnly
      && <StickyHeader className={styles.header}>
        <LinearProgress variant='determinate' value={progress * 100} color='secondary' />
      </StickyHeader>}
    {loading && <Centre>
      <CircularProgress className={styles.loader} />
    </Centre>}

    {store.stream.length !== 0 && <StreamList onProgressChanged={setProgress} />}

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

    <div className={styles.footer}>
      <StackPanel direction="column-reverse" center>
        <StackPanel direction="row">
          {unreadOnly && <LinkButton href="?showUnread" variant="contained" color="secondary" onClick={scrollToTop}>
            Show Unread
          </LinkButton>}
          <LinkButton href="/subscriptions?query=" variant="contained" color="secondary">
            Add Subscriptions
          </LinkButton>
          <Button disabled={loading} variant="contained" color="secondary" onClick={() => updateStreams(props.id)}>
            {loading && <CircularProgress size={16} className={styles.footerLoader} />} Refresh
          </Button>
        </StackPanel>
        <Typography variant='h2'>That's everything!</Typography>
      </StackPanel>
    </div>
  </div>
}