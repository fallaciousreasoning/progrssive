import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import { Add } from '@material-ui/icons';
import Refresh from '@material-ui/icons/Refresh';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { collect, Store } from 'react-recollect';
import { useHistory, useLocation } from 'react-router-dom';
import { updateStreams } from '../../../actions/stream';
import AppBarButton from '../../../components/AppBarButton';
import Centre from '../../../components/Centre';
import MarkAsReadButton from '../../../components/MarkAsReadButton';
import MaybeUpdateStreamList from '../../../components/MaybeUpdateStreamList';
import StreamFooter from '../../../components/StreamFooter';
import { useIsPhone } from '../../../hooks/responsive';
import { getStore, getStreamUpdating } from '../../../hooks/store';
import { useIsTransientSubscription } from '../../../hooks/subscription';
import useWhenChanged from '../../../hooks/useWhenChanged';
import { markStreamAs, setStreamList } from '../../../services/store';
import { findSubscription, toggleSubscription } from '../../../services/subscriptions';
import StreamList from '../../../components/StreamList';
import { delay } from '../../../utils/promise';
import { useSettings } from '../../../services/settings';

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

const StreamViewer = (props: { id: string, store: Store }) => {
  const styles = useStyles();
  const location = useLocation();
  const isPhone = useIsPhone();
  const active = location.pathname.includes('/stream')
    && (!isPhone || !location.pathname.includes('/entries/'));
  const history = useHistory();
  const rootRef = useRef<HTMLDivElement>();
  const footerRef = useRef<HTMLDivElement>();
  const isTransient = useIsTransientSubscription(props.id, props.store);
  const [isAdding, setIsAdding] = useState(false);
  const settings = useSettings();

  const scrollToTop = useCallback(() => {
    rootRef.current && rootRef.current.scrollTo(0, 0);
  }, [rootRef.current]);

  const unreadOnly = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return !params.has('showUnread');
  }, [location.search]);

  const toggleUnreadOnly = useCallback(() => {
    history.replace(`?${unreadOnly ? "showUnread" : ""}`);
  }, [unreadOnly, history]);


  const loading = !!getStreamUpdating(props.id) || props.store.stream.length === undefined;
  useWhenChanged(() =>
    setStreamList(unreadOnly, props.id),
    [unreadOnly, props.id]);

  // Show the stream list when it gets items.
  useWhenChanged(scrollToTop,
    // When we get some entries in the stream, we should not be looking
    // at the footer.
    [props.store.stream.length]);

  const onFooterScrolled = useCallback(e => {
    // Don't mark entries as read when we're also showing read
    // articles.
    if (!unreadOnly)
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
  }, [unreadOnly])

  const [progress, setProgress] = useState(0);
  const remainingArticles = Math.round(props.store.stream.length - progress * props.store.stream.length);

  return <div ref={rootRef} className={styles.root} onScroll={onFooterScrolled}>
    {loading && <Centre>
      <CircularProgress className={styles.loader} />
    </Centre>}

    <MaybeUpdateStreamList streamId={props.id} />
    {props.store.stream.length !== 0 && <StreamList onProgressChanged={setProgress} />}

    {active && <>
      <AppBarButton>
        <MarkAsReadButton progress={progress} text={isNaN(remainingArticles) ? "" : remainingArticles.toString()} />
      </AppBarButton>
      {isTransient
        ? <AppBarButton>
          {isAdding
            ? <CircularProgress color="secondary" size={24} />
            : <IconButton onClick={async () => {
              setIsAdding(true);
              await toggleSubscription(findSubscription(props.id));
              await delay(1000);
              setIsAdding(false);
            }}>
              <Add/>
            </IconButton>}
        </AppBarButton>
        : <AppBarButton>
          <FormControlLabel
            className={styles.unreadOnlySlider}
            control={<Switch checked={unreadOnly} onClick={toggleUnreadOnly} />}
            label="Unread" />
        </AppBarButton>}
      <AppBarButton>
        <IconButton disabled={loading} onClick={() => updateStreams(props.id)}>
          <Refresh />
        </IconButton>
      </AppBarButton>
    </>}

    <div className={styles.footer} ref={footerRef}>
      <StreamFooter unreadOnly={unreadOnly} />
    </div>
  </div >
}

export default collect(StreamViewer);