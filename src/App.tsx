import { IconButton, Toolbar, Typography, Switch } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import React, { useState } from 'react';
import { BrowserRouter, Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import EntryViewer from './EntryViewer';
import { RestoreScroll } from './Scroller';
import StreamViewer from './StreamViewer';
import { theme } from './theme';
import { mapStyles } from './transitions';
import { slideTransition } from './transitions/slideTransition';
import AppBar from './AppBar';
import SwipeableViews from 'react-swipeable-views';
import { useStore } from './hooks/store';
import { getAllId } from './api/streams';
import { useProfile } from './hooks/profile';
import Routes from './Routes';

const useStyles = makeStyles({
  root: {
    margin: '10px',
  }
});

export const App = (props) => {
  // const styles = useStyles();
  console.log('here')

  return <BrowserRouter>
    <ThemeProvider theme={theme}>
      <AppBar />

      <div >
        <RestoreScroll />
        <Routes/>
      </div>
    </ThemeProvider>
  </BrowserRouter>;
};

export default App;
