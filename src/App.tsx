import { IconButton, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import React, { Component } from 'react';
import ArticlesList from './ArticlesList';

class App extends Component {
  render() {
    const items = [1,2,3,4,5,6,7,8,9];
    return <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton>
            <MenuIcon />
          </IconButton>
          <Typography variant="title">Progrssive Reader</Typography>
        </Toolbar>
      </AppBar>
      
      <ArticlesList/>
    </div>;
  }
}

export default App;
