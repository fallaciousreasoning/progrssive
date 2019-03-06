import { store as s } from 'react-recollect';
import { Stream } from '../model/stream';
import { StoreDef } from '../types/RecollectStore';
const store = s as StoreDef;
 
export const initStore = () => {
    store.categories = {};
    store.entries = {};

    // Include our fake stream by default.
    updateStream(require('../fakeStream.json'));
}

export const updateStream = (stream: Stream) => {
    store.categories[stream.id] = {
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