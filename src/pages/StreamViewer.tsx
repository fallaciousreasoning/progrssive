import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Refresh from '@material-ui/icons/Refresh';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { setUnread } from '../actions/marker';
import { updateStreams } from '../actions/stream';
import AppBarButton from '../components/AppBarButton';
import Centre from '../components/Centre';
import ProgressRing from '../components/ProgressRing';
import StreamFooter from '../components/StreamFooter';
import { getStore, isUpdating, useStore } from '../hooks/store';
import { useIsTransientSubscription } from '../hooks/subscription';
import useWhenChanged from '../hooks/useWhenChanged';
import { useIsActive } from '../Routes';
import { getUnreadStreamEntryIds, setEntryList, setTransientEntryList } from '../services/store';
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
  },
  loader: {
    marginBottom: theme.spacing(),
  },
  footer: {
    scrollSnapAlign: 'start',
    height: `calc(100vh - 48px - ${theme.spacing(2)}px)`
  },
  unreadOnlySlider: {
    color: theme.palette.text.primary
  }
}));

export default (props: { id: string, location: Location, active: boolean }) => {
  const store = useStore();
  const styles = useStyles();
  const location = props.location;
  const history = useHistory();
  const rootRef = useRef<HTMLDivElement>();
  const footerRef = useRef<HTMLDivElement>();
  const isTransient = useIsTransientSubscription(props.id);

  const scrollToTop = useCallback(() => {
    rootRef.current && rootRef.current.scrollTo(0, 0);
  }, [rootRef.current]);

  const unreadOnly = useMemo(() => {
    // Transient streams don't have unread articles.
    if (isTransient)
      return false;

    const params = new URLSearchParams(location.search);
    return !params.has('showUnread');
  }, [location.search, isTransient]);

  const toggleUnreadOnly = useCallback(() => {
    history.replace(`?${unreadOnly ? "showUnread" : ""}`);
  }, [unreadOnly, history]);

  const loading = isUpdating('stream');
  useWhenChanged(() => {
    if (isTransient) {
      setTransientEntryList(props.id);
    } else {
      setEntryList(unreadOnly, props.id);
    }
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
  const remainingArticles = Math.round(store.stream.length - progress * store.stream.length);

  return <div ref={rootRef} className={styles.root} onScroll={onFooterScrolled}>
    {loading && <Centre>
      <CircularProgress className={styles.loader} />
    </Centre>}

    {store.stream.length !== 0 && <StreamList onProgressChanged={setProgress} />}

    {props.active && <>
      <AppBarButton>
        <ProgressRing key="progress" percent={progress} text={remainingArticles} />
      </AppBarButton>
      <AppBarButton>
        <IconButton disabled={loading} onClick={() => updateStreams(props.id)}>
          <Refresh />
        </IconButton>
      </AppBarButton>
      {!isTransient && <AppBarButton>
        <FormControlLabel
          className={styles.unreadOnlySlider}
          control={<Switch checked={unreadOnly} onClick={toggleUnreadOnly} />}
          label="Unread" />
      </AppBarButton>}
    </>}

    <div className={styles.footer} ref={footerRef}>
      <StreamFooter unreadOnly={unreadOnly} />
    </div>
  </div >
}