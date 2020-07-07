import { CircularProgress, FormControlLabel, IconButton, LinearProgress, makeStyles, Switch } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { updateStreams } from '../actions/stream';
import AppBarButton from '../components/AppBarButton';
import Centre from '../components/Centre';
import StickyHeader from '../components/StickyHeader';
import StreamFooter from '../components/StreamFooter';
import { isUpdating, useStore, getStore } from '../hooks/store';
import useWhenChanged from '../hooks/useWhenChanged';
import { setEntryList, getUnreadStreamEntryIds } from '../services/store';
import StreamList from '../StreamList';
import { setUnread } from '../actions/marker';

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
  unreadOnlySlider: {
    color: theme.palette.text.primary
  }
}));

export default (props: { id: string, location: Location }) => {
  const store = useStore();
  const styles = useStyles();
  const location = props.location;
  const history = useHistory();
  const rootRef = useRef<HTMLDivElement>();
  const footerRef = useRef<HTMLDivElement>();

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

  const onFooterScrolled = useCallback(e => {
    // Don't mark entries as read when we're also showing read
    // articles.
    if (!unreadOnly)
      return;

    // If we aren't meant to mark scrolled entries as read,
    // continue.
    if (!getStore().settings.markScrolledAsRead)
      return;

    // Don't go any further if it wasn't the root that scrolled.
    if (e.target !== rootRef.current)
      return;

    const footerTop = footerRef.current.getBoundingClientRect().top;
    const pageTop = rootRef.current.getBoundingClientRect().top;
    if (footerTop > pageTop)
      return;

    const entriesToMark = getUnreadStreamEntryIds();
    for (const id of entriesToMark)
      setUnread(id, false);
  }, [unreadOnly])

  const [progress, setProgress] = useState(0);

  return <div ref={rootRef} className={styles.root} onScroll={onFooterScrolled}>
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
        className={styles.unreadOnlySlider}
        control={<Switch checked={unreadOnly} onClick={toggleUnreadOnly} />}
        label="Unread" />
    </AppBarButton>

    <div className={styles.footer} ref={footerRef}>
      <StreamFooter unreadOnly={unreadOnly} />
    </div>
  </div>
}