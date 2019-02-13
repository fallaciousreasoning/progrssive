import { Grid } from '@material-ui/core';
import React from 'react';
import Entry from "./Entry";
import { stream } from './faking/fakeStream';

export default (props) => {
    const entries = stream.items;

    return <Grid spacing={24} container justify='center' wrap='wrap'>
        {entries.map(e => <Grid item key={e.id} xl={2} lg={3} md={4} sm={6} xs={12}>
          <Entry entry={e}/>
        </Grid>)}
    </Grid>
}