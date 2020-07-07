import { Button, CircularProgress, FormControlLabel, IconButton, LinearProgress, makeStyles, Switch, Typography } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { updateStreams } from '../actions/stream';
import AppBarButton from '../components/AppBarButton';
import Centre from '../components/Centre';
import LinkButton from '../components/LinkButton';
import StackPanel from '../components/StackPanel';
import StickyHeader from '../components/StickyHeader';
import { useIsPhone } from '../hooks/responsive';
import { isUpdating, useStore } from '../hooks/store';
import useWhenChanged from '../hooks/useWhenChanged';
import { setEntryList } from '../services/store';
import StreamList from '../StreamList';

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

export default (props: { id: string, location: Location }) => {
  const store = useStore();
  const styles = useStyles();
  const location = props.location;
  const history = useHistory();
  const rootRef = useRef<HTMLDivElement>();
  const hasSubscriptions = store.subscriptions.length !== 0;

  const scrollToTop = useCallback(() => {
    rootRef.current && rootRef.current.scrollTo(0, 0);
  }, []);

  const unreadOnly = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return !params.has('showUnread');
  }, [location.search]);
  const toggleUnreadOnly = useCallback(() => {
    history.replace(`?${unreadOnly ? "showUnread" : ""}`);
  }, [unreadOnly, history]);

  const loading = isUpdating('stream');
  useWhenChanged(() => {
    setEntryList(unreadOnly, props.id);
  },
    [unreadOnly, props.id, store.lastUpdate, scrollToTop]);

  // Show the stream list when it gets items.
  useWhenChanged(scrollToTop,
    // When we get some entries in the stream, we should not be looking
    // at the footer.
    [store.stream.length]);

  const [progress, setProgress] = useState(0);
  const isPhone = useIsPhone();

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
        <StackPanel direction={isPhone ? 'column' : 'row'}>
          {unreadOnly && hasSubscriptions && <LinkButton fullWidth href="?showUnread" variant="contained" color="secondary" onClick={scrollToTop}>
            Show Unread
          </LinkButton>}
          <LinkButton fullWidth href="/subscriptions?query=" variant="contained" color="secondary">
            Add Subscriptions
          </LinkButton>
          {hasSubscriptions && <Button fullWidth disabled={loading} variant="contained" color="secondary" onClick={() => updateStreams(props.id)}>
            {loading && <CircularProgress size={16} className={styles.footerLoader} />} Refresh
          </Button>}
        </StackPanel>
        <Typography variant='h3' align='center'>
          {hasSubscriptions ? "That's everything!" : "You don't have any subscriptions"}
        </Typography>
      </StackPanel>
    </div>
  </div>
}