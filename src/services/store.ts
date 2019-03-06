import { store } from 'react-recollect';
import { Stream } from '../model/stream';

export const initStore = () => {
    store.profile = undefined;
    store.categories = {};
    store.entries = {};
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

export const getStream = (streamId: string): Stream => {
    const stream = store.categories[streamId];
    return {
        ...stream,
        items: stream.items.map(i => store.entries[i])
    };
}