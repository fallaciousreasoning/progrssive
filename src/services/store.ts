import { store as s } from 'react-recollect';
import { Stream } from '../model/stream';
import { Subscription } from '../model/subscription';
import { StoreDef } from '../types/RecollectStore';
const store = s as StoreDef;
 
export const initStore = () => {
    store.streams = {};
    store.entries = {};

    // Include our fake stream by default.
    updateStream(require('../fakeStream.json'));
    store.collections = require('../fakeCollections.json');
}

export const updateStream = (stream: Stream) => {
    store.streams[stream.id] = {
        ...stream,
        items: stream.items.map(i => i.id)
    };

    const entryUpdate = stream.items.reduce((prev, next) => ({
        ...prev,
        [next.id]: next
    }), {});

    store.entries = {
        ...store.entries,
        ...entryUpdate
    };
}