import { IconButton, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import Entry from './Entry';
import { Stream } from './model/stream';
import { theme } from './theme';

const useStyles = makeStyles({
  root: {
    marginTop: '10px'
  }
});

export const App = (props) => {
  const [stream, setStream] = useState<Stream>();
  const styles = useStyles();

  useEffect(() => {
    if (stream) return;
    setStream(require('./fakeStream.json'));
    //getProfile().then(profile => getAllStream(profile.id, false)).then(setStream);
  });

  return <ThemeProvider theme={theme}>
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton>
          <MenuIcon />
        </IconButton>
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
