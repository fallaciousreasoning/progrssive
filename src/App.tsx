import { IconButton, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatedRoute } from 'react-router-transition';
import AppDrawer from './AppDrawer';
import EntryViewer from './EntryViewer';
import StreamViewer from './StreamViewer';
import { theme } from './theme';
import { mapStyles } from './transitions';
import { slideTransition } from './transitions/slideTransition';

const useStyles = makeStyles({
  root: {
    margin: '10px',
  }
});

export const App = (props) => {
  const styles = useStyles();

  return <BrowserRouter>
    <ThemeProvider theme={theme}>

      <AppBar position="static" color="primary">
        <Toolbar>
          <AppDrawer trigger={
            <IconButton>
              <MenuIcon />
            </IconButton>} />
          <Typography variant="title">Progrssive Reader</Typography>
        </Toolbar>
      </AppBar>
      <div className={styles.root}>
          <AnimatedRoute path='/stream/:streamId*' component={StreamViewer}  atEnter={slideTransition.atEnter} atLeave={slideTransition.atLeave} atActive={slideTransition.atActive} mapStyles={mapStyles} />
          <AnimatedRoute path='/entries/:entryId*' component={EntryViewer}  atEnter={slideTransition.atEnter} atLeave={slideTransition.atLeave} atActive={slideTransition.atActive} mapStyles={mapStyles}/>
      </div>
    </ThemeProvider>
  </BrowserRouter>;
}

export default App;
