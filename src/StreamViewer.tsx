import { CircularProgress, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import EntryCard from "./EntryCard";
import { useStream } from './hooks/stream';

const useStyles = makeStyles({
  root: {
  }
});

export default (props: { match: { params: { streamId: string }}}) => {
  const classes = useStyles();
  const stream = useStream(props.match.params.streamId);

  if (!stream || !stream.items)
    return <CircularProgress/>;

  return <div className={classes.root}>
    <Grid spacing={24} container justify='center' wrap='wrap'>
      {stream.items.map(e => <Grid item key={e.id} lg={3} md={6} sm={12}>
        <EntryCard entry={e} />
      </Grid>)}
    </Grid>
  </div>
}