import { IconButton, Toolbar, Typography, Switch } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import EntryViewer from './EntryViewer';
import { RestoreScroll } from './components/Scroller';
import StreamViewer from './StreamViewer';
import { theme } from './theme';
import { mapStyles } from './transitions';
import { slideTransition } from './transitions/slideTransition';
import AppBar from './AppBar';
import SwipeableViews from 'react-swipeable-views';
import { useStore, getStore } from './hooks/store';
import { getAllId } from './api/streams';
import { useProfile } from './hooks/profile';
import RouteManager, { AppRoute } from './RouteManager';

const useStyles = makeStyles({
  root: {
    width: '100vw',
    height: '100vw'
  }
});

const routes: AppRoute[] = [
  {
    prefix: '/stream/',
    render: id => <StreamViewer streamId={id}/>
  },
  {
    prefix: '/entries/',
    render: id => <EntryViewer entryId={id}/>
  }
];

export const App = (props) => {
  const styles = useStyles();
  const store = getStore();
  const profile = useProfile();

  useEffect(() => {
    if (store.current['/stream/'] || !profile) return;

    store.current['/stream/'] = getAllId(profile.id);
  }, [store.current, profile]);

  return <BrowserRouter>
    <ThemeProvider theme={theme}>
      <div className={styles.root}>
        <AppBar />
        <RouteManager routes={routes}/>
      </div>
    </ThemeProvider>
  </BrowserRouter>;
};

export default App;
