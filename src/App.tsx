import { IconButton, MuiThemeProvider, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useEffect, useState } from 'react';
import { getProfile } from './api/profile';
import { getAllStream } from './api/streams';
import EntryList from './EntryList';
import { Stream } from './model/stream';
import { theme } from './theme';

export const App = (props) => {
  const [stream, setStream] = useState<Stream>();
  
  useEffect(() => {
    if (stream) return;
    
    getProfile().then(profile => getAllStream(profile.id, false)).then(setStream);
  }); 
  return <MuiThemeProvider theme={theme}>
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton>
          <MenuIcon />
        </IconButton>
        <Typography variant="title">Progrssive Reader</Typography>
      </Toolbar>
    </AppBar>

    <EntryList stream={stream} />
  </MuiThemeProvider>;
}

export default App;
