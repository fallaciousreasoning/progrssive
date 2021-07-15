import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import Refresh from '@material-ui/icons/Refresh';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { collect, Store } from 'react-recollect';
import { updateStreams } from '../../../actions/stream';
import AppBarButton from '../../../components/AppBarButton';
import Centre from '../../../components/Centre';
import MarkAsReadButton from '../../../components/MarkAsReadButton';
import MaybeUpdateStreamList from '../../../components/MaybeUpdateStreamList';
import StreamFooter from '../../../components/StreamFooter';
import { useIsPhone } from '../../../hooks/responsive';
import { getStreamUpdating } from '../../../hooks/store';
import { useIsTransientSubscription } from '../../../hooks/subscription';
import useWhenChanged from '../../../hooks/useWhenChanged';
import { markStreamAs, setStreamList } from '../../../services/store';
import { findSubscription, toggleSubscription } from '../../../services/subscriptions';
import StreamList from '../../../components/StreamList';
import { delay } from '../../../utils/promise';
import { useSettings } from '../../../services/settings';
import { useRouter } from 'next/dist/client/router';
import { useShowRead, useStreamId } from '../../../hooks/url';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Toggle from '../../../components/Toggle';

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
  footer: {
    scrollSnapAlign: 'start',
    height: `calc(100vh - 48px - ${theme.spacing(2)}px)`
  },
  unreadOnlySlider: {
    color: theme.palette.text.primary
  }
}));

let loaded = false;

const StreamViewer = (props: { store: Store }) => {
  const styles = useStyles();
  const isPhone = useIsPhone();
  const router = useRouter();
  const streamId = useStreamId();
  const active = router.pathname.includes('/stream')
    && (!isPhone || !router.pathname.includes('/entry/'));
  const rootRef = useRef<HTMLDivElement>();
  const footerRef = useRef<HTMLDivElement>();
  const isTransient = useIsTransientSubscription(streamId);
  const [isAdding, setIsAdding] = useState(false);
  const settings = useSettings();

  // We need to do this here, so we don't try and do it on the server side.
  useEffect(() => {
    if (loaded) return;
    updateStreams();
    loaded = true;
  }, []);

  const scrollToTop = useCallback(() => {
    rootRef.current && rootRef.current.scrollTo(0, 0);
  }, [rootRef.current]);

  const { showRead, setShowRead } = useShowRead();
  const toggleShowRead = useCallback(() => setShowRead(!showRead), [showRead]);

  const loading = !!getStreamUpdating(streamId) || props.store.stream.length === undefined;
  useWhenChanged(() =>
    setStreamList(!showRead, streamId),
    [showRead, streamId]);

  // Show the stream list when it gets items.
  useWhenChanged(scrollToTop,
    // When we get some entries in the stream, we should not be looking
    // at the footer.
    [props.store.stream.length]);

  const onFooterScrolled = useCallback(e => {
    // Don't mark entries as read when we're also showing read
    // articles.
    if (showRead)
      return;

    // If we aren't meant to mark scrolled entries as read,
    // continue.
    if (settings.markScrolledAsRead)
      return;

    // Don't go any further if it wasn't the root that scrolled.
    if (e.target !== rootRef.current)
      return;

    const footerTop = footerRef.current.getBoundingClientRect().top;
    const pageTop = rootRef.current.getBoundingClientRect().top;
    if (footerTop > pageTop)
      return;

    markStreamAs('read');
  }, [showRead])

  const [progress, setProgress] = useState(0);
  const remainingArticles = Math.round(props.store.stream.length - progress * props.store.stream.length);

  return <div ref={rootRef} className={styles.root} onScroll={onFooterScrolled}>
    {loading && <Centre>
      <LoadingSpinner color='primary'/>
    </Centre>}

    <MaybeUpdateStreamList streamId={streamId} />
    {props.store.stream.length !== 0 && <StreamList onProgressChanged={setProgress} />}

    {active && <>
      {isTransient
        ? <AppBarButton>
          {isAdding
            ? <LoadingSpinner color="secondary" size={6} />
            : <IconButton onClick={async () => {
              setIsAdding(true);
              await toggleSubscription(findSubscription(streamId));
              await delay(1000);
              setIsAdding(false);
            }}>
              <Add />
            </IconButton>}
        </AppBarButton>
        : <AppBarButton>
            <Toggle checked={!showRead} onChange={toggleShowRead} label="Unread" />
        </AppBarButton>}
      <AppBarButton>
        <IconButton disabled={loading} onClick={() => updateStreams(streamId)}>
          <Refresh />
        </IconButton>
      </AppBarButton>
      <AppBarButton>
        <MarkAsReadButton progress={progress} text={isNaN(remainingArticles) ? "" : remainingArticles.toString()} />
      </AppBarButton>
    </>}

    <div className={styles.footer} ref={footerRef}>
      <StreamFooter unreadOnly={!showRead} streamId={streamId} />
    </div>
  </div >
}

export default collect(StreamViewer);