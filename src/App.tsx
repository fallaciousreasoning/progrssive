import { IconButton, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import React, { useEffect } from 'react';
import AppDrawer from './AppDrawer';
import Entry from './Entry';
import { useStore } from './hooks/store';
import { getStream, updateStream } from './services/store';
import { theme } from './theme';

const useStyles = makeStyles({
  root: {
    marginTop: '10px'
  }
});

export const App = (props) => {
  const styles = useStyles();

  const store = useStore();
  const stream = getStream('user/e8ca5f09-ffa1-43d8-9f28-867ed8ad876a/category/global.all');
  console.log(stream);

  useEffect(() => {
    if (stream) return;
    const newStream = require('./fakeStream.json');
    updateStream(newStream);
  });

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
      <Entry entry={stream && stream.items[0]} />
      {/* <EntryList stream={stream} /> */}
    </div>
  </ThemeProvider>;
}

export default App;
