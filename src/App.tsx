import { IconButton, Toolbar, Typography, Switch, MuiThemeProvider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import EntryViewer from './EntryViewer';
import { RestoreScroll } from './components/Scroller';
import StreamViewer from './StreamViewer';
import { buildTheme } from './theme';
import { mapStyles } from './transitions';
import { slideTransition } from './transitions/slideTransition';
import AppBar from './AppBar';
import SwipeableViews from 'react-swipeable-views';
import { useStore, getStore } from './hooks/store';
import { getAllId } from './api/streams';
import { useProfile } from './hooks/profile';
import RouteManager, { AppRoute } from './RouteManager';
import SettingsPage from './SettingsPage';
import { SnackbarProvider } from 'notistack';
import { SnackbarHelper } from './components/SnackbarHelper';

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
