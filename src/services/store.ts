import { store as s } from 'react-recollect';
import { Stream } from '../model/stream';
import { Subscription } from '../model/subscription';
import { StoreDef, StoreStream } from '../types/RecollectStore';
import { Entry } from '../model/entry';
import { getStore } from '../hooks/store';
import { saveChildren, loadStore } from './persister';
import { loadSettings } from '../actions/settings';
const store = s as StoreDef;

let initStorePromise: Promise<void>;
export const initStore = () => {
    if (initStorePromise)
        return initStorePromise;

    store.streams = {};
    store.entries = {};
    store.updating = {
        categories: false,
        stream: false,
    };
    store.settings = loadSettings();
    store.current = {
    };
    store.subscriptions = [];

    initStorePromise = loadStore();
    return initStorePromise;

    // Include our fake stream by default.
    // setAllStreams(store.profile.id, require('../fakeStream.json'));
    // store.collections = require('../fakeCollections.json');
}

export const getStream = (streamId: string): Stream => {
    const store = getStore();
    const stream = store.streams[streamId];
    if (!stream) return;
    return {
        ...stream,
        items: stream.items
            .map(i => store.entries[i])
            .filter(e => e)
            .filter(e => e.unread || !store.settings.unreadOnly)
    };
}