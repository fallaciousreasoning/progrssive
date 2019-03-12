import { IconButton, Toolbar, Typography } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import EntryViewer from './EntryViewer';
import { RestoreScroll } from './Scroller';
import StreamViewer from './StreamViewer';
import { theme } from './theme';
import { mapStyles } from './transitions';
import { slideTransition } from './transitions/slideTransition';
import AppBar from './AppBar';

const useStyles = makeStyles({
  root: {
    margin: '10px',
  }
});

export const App = (props) => {
  const styles = useStyles();

  return <BrowserRouter>
    <ThemeProvider theme={theme}>
      <AppBar/>

        <div className={styles.root}>
          <RestoreScroll />
          <AnimatedSwitch atEnter={slideTransition.atEnter} atLeave={slideTransition.atLeave} atActive={slideTransition.atActive} mapStyles={mapStyles}>
            <Route path='/stream/:streamId*' component={StreamViewer} />
            <Route path='/entries/:entryId*' component={EntryViewer} />
            {/* TODO: Remove hacky redirect for testing */}
            <Redirect to='/stream/user/e8ca5f09-ffa1-43d8-9f28-867ed8ad876a/category/global.all' />
          </AnimatedSwitch>
        </div>
    </ThemeProvider>
  </BrowserRouter>;
}

export default App;
