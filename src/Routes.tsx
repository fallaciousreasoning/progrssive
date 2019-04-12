import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useStore } from './hooks/store';
import { useProfile } from './hooks/profile';
import { useState } from 'react';
import { getAllId } from './api/streams';
import StreamViewer from './StreamViewer';
import EntryViewer from './EntryViewer';
import { Route, RouteComponentProps, withRouter } from 'react-router';

export default withRouter((props) => {
    const store = useStore();
    const profile = useProfile();
    const [activeSlide, setActiveSlide] = useState(0);
    return <>
        <SwipeableViews
            index={activeSlide}
            onChangeIndex={(o, n) => {
                const types = ['stream', 'entries'];
                const prefix = types[n];

                props.history.push(`${prefix}/${prefix === 'stream' ? store.current.streamId : store.current.entryId}`)
            }}
            style={{ padding: '10px' }}
            slideStyle={{ overflow: 'hidden' }}>
            <StreamViewer streamId={store.current.streamId || getAllId(profile && profile.id)} />
            <EntryViewer entryId={store.current.entryId} />
        </SwipeableViews>
        <Route path='/stream/:streamId*' component={props => {
            // We have to manually parse the path, because redux router breaks.
            const prefix = 'stream/';
            const streamId = props.location.pathname.substr(prefix.length + 1);
            store.current.streamId = streamId;
            setActiveSlide(0);
            return null;
        }} />

        <Route path='/entries/:entryId*' component={(props: RouteComponentProps<{ entryId: string }>) => {
            store.current.entryId = props.match.params.entryId;
            setActiveSlide(1);
            return null;
        }} />
    </>
});