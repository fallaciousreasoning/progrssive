import { IconButton, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import React, { Component } from 'react';
import EntryList from './EntryList';

const entryListStyle: React.CSSProperties = {
  marginTop: '12px'
};

class App extends Component {
  render() {
    return <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton>
            <MenuIcon />
          </IconButton>
          <Typography variant="title">Progrssive Reader</Typography>
        </Toolbar>
      </AppBar>
      
      <div style={entryListStyle}> </div>
      <EntryList/>
    </div>;
  }
}

export default App;
