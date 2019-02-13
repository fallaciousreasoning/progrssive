import React from 'react';
import Entry from "./Entry";
import { stream } from './faking/fakeStream';

export default (props) => {
    const entries = stream.items;

    return <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        {entries.map((e, i) => <div style={{ flexBasis: '40%', margin: '5px' }}>
            <Entry entry={e} key={e.id || i} />
        </div>)}
    </div>
}