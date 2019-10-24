import { MuiThemeProvider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import React, { useEffect, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { getAllId } from './api/streams';
import AppBar from './AppBar';
import { SnackbarHelper } from './components/SnackbarHelper';
import EntryViewer from './EntryViewer';
import { useProfile } from './hooks/profile';
import { useStore } from './hooks/store';
import RouteManager, { AppRoute } from './RouteManager';
import SettingsPage from './SettingsPage';
import StreamViewer from './StreamViewer';
import { buildTheme } from './theme';
import "./api/markers";
import { getAllUnread } from './actions/stream';

const useStyles = makeStyles({
  root: {
    width: '100vw',
    height: '100vw'
  }
});

const routes: AppRoute[] = [
  {
    prefix: '/settings/',
    render: () => <SettingsPage />
  },
  {
    prefix: '/stream/',
    render: (id, active) => <StreamViewer id={id} active={active} />
  },
  {
    prefix: '/entries/',
    render: (id, active) => <EntryViewer id={id} active={active} />
  }
];

getAllUnread();

export const App = (props) => {
  const styles = useStyles();
  const store = useStore();
  const profile = useProfile();

  const theme = useMemo(() => {
    return buildTheme(store.settings);
  }, [store.settings.fontSize]);

  useEffect(() => {
    if (store.current['/stream/'] || !profile) return;

    store.current['/stream/'] = getAllId(profile.id);
  }, [store.current, profile]);

  return <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider>
        <SnackbarHelper/>
        <div className={styles.root}>
          <AppBar />
          <RouteManager routes={routes} />
        </div>
      </SnackbarProvider>
    </MuiThemeProvider>
  </BrowserRouter>;
};

export default App;
