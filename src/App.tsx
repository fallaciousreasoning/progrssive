import { IconButton, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AppDrawer from './AppDrawer';
import Entry from './Entry';
import StreamViewer from './StreamViewer';
import { theme } from './theme';

const useStyles = makeStyles({
  root: {
    marginTop: '10px'
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
        <Switch>
          <Route path='/stream/:streamId*' component={StreamViewer} />
          <Route path='/entry/:entryId' component={Entry} />
        </Switch>
        {/* <StreamViewer streamId='user/e8ca5f09-ffa1-43d8-9f28-867ed8ad876a/category/global.all' /> */}
      </div>
    </ThemeProvider>
  </BrowserRouter>;
}

export default App;
