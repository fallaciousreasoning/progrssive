import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles'
import React from 'react';
import Entry from "./Entry";
import { stream } from './faking/fakeStream';

const useStyles = makeStyles({
  root: {
    margin: '10px'
  }
});

export default (props) => {
  const classes = useStyles();
  const entries = props.stream ? props.stream.items : stream.items;

  return <div className={classes.root}>
    <Grid spacing={24} container justify='center' wrap='wrap'>
      {entries.map(e => <Grid item key={e.id} lg={3} md={6} sm={12}>
        <Entry entry={e} />
      </Grid>)}
    </Grid>
  </div>
}