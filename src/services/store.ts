import { store as s } from 'react-recollect';
import { Stream } from '../model/stream';
import { StoreDef } from '../types/RecollectStore';
const store = s as StoreDef;
 
export const initStore = () => {
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
    if (!stream)
      return undefined;
      
    return {
        ...stream,
        items: stream.items.map(i => store.entries[i])
    };
}