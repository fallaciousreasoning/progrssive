import { IconButton, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import React from 'react';
import AppDrawer from './AppDrawer';
import StreamViewer from './StreamViewer';
import { theme } from './theme';

const useStyles = makeStyles({
  root: {
    marginTop: '10px'
  }
});

export const App = (props) => {
  const styles = useStyles();

  return <ThemeProvider theme={theme}>
    <AppBar position="static" color="primary">
      <Toolbar>
        <AppDrawer trigger={
          <IconButton>
            <MenuIcon />
          </IconButton>}/>
        <Typography variant="title">Progrssive Reader</Typography>
      </Toolbar>
    </AppBar>
    <div className={styles.root}>
      {/* <Entry entry={stream && stream.items[0]} /> */}
      <StreamViewer streamId='user/e8ca5f09-ffa1-43d8-9f28-867ed8ad876a/category/global.all'/>
    </div>
  </ThemeProvider>;
}

export default App;
