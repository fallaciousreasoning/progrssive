import { IconButton, Toolbar, Typography, MuiThemeProvider } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import React, { Component, useState, useEffect } from 'react';
import EntryList from './EntryList';
import { theme } from './theme';
import { getStream } from './api/streams';
import { stream } from './faking/fakeStream';
import { Stream } from './model/stream';

export const App = (props) => {
  const [stream, setStream] = useState<Stream>();
  
  useEffect(() => {
    getStream('user/e8ca5f09-ffa1-43d8-9f28-867ed8ad876a/category/global.all', 'content').then(setStream);
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
