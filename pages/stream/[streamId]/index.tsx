import Add from '../../../icons/add.svg';
import Refresh from '../../../icons/refresh.svg';
import { updateStreams } from 'actions/stream';
import AppBarButton from 'components/AppBarButton';
import Centre from 'components/Centre';
import IconButton from 'components/IconButton';
import LoadingSpinner from 'components/LoadingSpinner';
import MarkAsReadButton from 'components/MarkAsReadButton';
import MaybeUpdateStreamList from 'components/MaybeUpdateStreamList';
import StreamFooter from 'components/StreamFooter';
import StreamList from 'components/StreamList';
import Toggle from 'components/Toggle';
import { useIsPhone } from 'hooks/responsive';
import { getStreamUpdating } from 'hooks/store';
import { useIsTransientSubscription } from 'hooks/subscription';
import { useShowRead, useStreamId } from 'hooks/url';
import useWhenChanged from 'hooks/useWhenChanged';
import { useRouter } from 'next/dist/client/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { collect, Store } from 'react-recollect';
import { useSettings } from 'services/settings';
import { markStreamAs, setStreamList } from 'services/store';
import { findSubscription, toggleSubscription } from 'services/subscriptions';
import { delay } from 'utils/promise';

const StreamViewer = (props: { store: Store }) => {
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
    updateStreams();
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

  return <div ref={rootRef} className="stream-viewer max-height-page" onScroll={onFooterScrolled}>
    {loading && <Centre>
      <LoadingSpinner />
    </Centre>}

    <MaybeUpdateStreamList streamId={streamId} />
    {props.store.stream.length !== 0 && <div className="min-h-1">
      <StreamList onProgressChanged={setProgress} />
    </div>}

    {active && <>
      {isTransient
        ? <AppBarButton>
          {isAdding
            ? <LoadingSpinner color="text-secondary" size={6} />
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

    <div className="height-page" ref={footerRef}>
      <StreamFooter unreadOnly={!showRead} streamId={streamId} />
    </div>
  </div >
}

export default collect(StreamViewer);
