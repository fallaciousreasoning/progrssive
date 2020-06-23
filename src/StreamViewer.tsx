import { CircularProgress, FormControlLabel, IconButton, LinearProgress, makeStyles, Switch } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { updateStreams } from './actions/stream';
import AppBarButton from './components/AppBarButton';
import Centre from './components/Centre';
import StickyHeader from './components/StickyHeader';
import { isUpdating, useStore } from './hooks/store';
import { useUnreadCount } from './hooks/unread';
import { setEntryList } from './services/store';
import StreamList from './StreamList';

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

export default (props: { id: string, active: boolean }) => {
  const store = useStore();
  const styles = useStyles();

  const loading = isUpdating('stream');
  useEffect(() => {
    setEntryList(store.settings.unreadOnly, props.id);
  },
    // eslint-disable-next-line
    [store.settings.unreadOnly, props.id, store.lastUpdate]);

  const unreadCount = useUnreadCount(props.id);
  const readProgress = (store.entries.length - unreadCount) / store.entries.length * 100;

  return <div className={styles.root}>
    {store.settings.unreadOnly
      && <StickyHeader className={styles.header}>
        <LinearProgress variant='determinate' value={readProgress} color='secondary' />
      </StickyHeader>}
    {loading && <Centre>
      <CircularProgress className={styles.loader} />
    </Centre>}

    <StreamList />

    {props.active && <>
      <AppBarButton>
        <IconButton disabled={loading} onClick={() => updateStreams(props.id)}>
          <Refresh />
        </IconButton>
      </AppBarButton>
      <AppBarButton>
        <FormControlLabel
          control={<Switch checked={store.settings.unreadOnly} onClick={() => store.settings.unreadOnly = !store.settings.unreadOnly} />}
          label="Unread" />
      </AppBarButton>
    </>}
  </div>
}