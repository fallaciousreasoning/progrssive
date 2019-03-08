import { CircularProgress, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import EntryCard from "./EntryCard";
import { useStream } from './hooks/stream';
import { useStore } from './hooks/store';

const useStyles = makeStyles({
  root: {
  }
});

type Props = RouteComponentProps<{ streamId: string}>;

export default (props: Props) => {
  const classes = useStyles();
  const stream = useStream(props.match.params.streamId);

  window['store'] = useStore();
  
  if (!stream || !stream.items)
    return <CircularProgress/>;

  return <div className={classes.root}>
    <Grid spacing={24} container justify='center' wrap='wrap'>
      {stream.items.map(e => <Grid item key={e.id} lg={3} md={6} sm={6} xs={12} onClick={() => props.history.push(`/entries/${e.id}`)}>
        <EntryCard entry={e}/>
      </Grid>)}
    </Grid>
  </div>
}