import { IconButton, Toolbar, Typography, MuiThemeProvider } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import React, { Component } from 'react';
import EntryList from './EntryList';
import { theme } from './theme';

class App extends Component {
  render() {
    return <MuiThemeProvider theme={theme}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton>
            <MenuIcon />
          </IconButton>
          <Typography variant="title">Progrssive Reader</Typography>
        </Toolbar>
      </AppBar>
      
      <EntryList/>
    </MuiThemeProvider>;
  }
}

export default App;
