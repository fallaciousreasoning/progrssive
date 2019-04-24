import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useStore } from './hooks/store';
import { useProfile } from './hooks/profile';
import { useState, useEffect } from 'react';
import { getAllId } from './api/streams';
import StreamViewer from './StreamViewer';
import EntryViewer from './EntryViewer';
import { Route, RouteComponentProps, withRouter } from 'react-router';
import { AppBar } from '@material-ui/core';

export default withRouter((props) => {
    const store = useStore();
    const profile = useProfile();
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        if (store.current.streamId || !profile) return;

        store.current.streamId = getAllId(profile.id);
    }, [store.current.streamId, profile]);

    console.log("Active:", activeSlide)

    return <>
        <SwipeableViews
            index={activeSlide}
            onChangeIndex={(n, o) => {
                console.log("old", o, "new", n)
                if (n === activeSlide) return;

                const types = ['stream', 'entries'];
                const prefix = types[n];

                let path: string;
                if (prefix === 'entries') {
                    path = store.current.entryId;
                } else {
                    path = store.current.streamId;
                }

                setActiveSlide((n + 1) % 2);
                props.history.push(`/${prefix}/${path}`);
            }}
            style={{ height: '100vh' }}
            enableMouseEvents
            containerStyle={{height: '100vh', paddingRight: '20px'}}
            slideStyle={{ overflowX: 'hidden', overflowY: 'auto', padding: '10px' }}>
            <StreamViewer streamId={store.current.streamId} />
            <EntryViewer entryId={store.current.entryId} />
        </SwipeableViews>
        <Route path='/stream/:streamId*' component={props => {
            // We have to manually parse the path, because redux router breaks.
            const prefix = 'stream/';
            const streamId = props.location.pathname.substr(prefix.length + 1);
            store.current.streamId = streamId;
            setActiveSlide(0);
            console.log('set stream')
            return null;
        }} />

        <Route path='/entries/:entryId*' component={(props: RouteComponentProps<{ entryId: string }>) => {
            store.current.entryId = props.match.params.entryId;
            setActiveSlide(1);
            console.log('set entry')
            return null;
        }} />
    </>
});