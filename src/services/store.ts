import { store as s } from 'react-recollect';
import { loadSettings } from '../actions/settings';
import { StoreDef } from '../types/RecollectStore';
import { loadStore } from './persister';
import { getStore } from '../hooks/store';
import { entryCount, entryIterator } from './entryIterator';
import { Entry } from '../model/entry';
const store = s as StoreDef;

let initStorePromise: Promise<void>;
export const initStore = () => {
    if (initStorePromise)
        return initStorePromise;

    store.updating = {
        categories: false,
        stream: 0,
    };
    store.settings = loadSettings();
    store.current = {
    };
    store.subscriptions = [];
    store.lastUpdate = Date.now();

    store.stream = {
        length: 0,
        loadedEntries: []
    };

    store.entries = {};

    initStorePromise = loadStore();
    return initStorePromise;
}

let streamIterator: AsyncGenerator<Entry> = undefined;
export const setEntryList = async (unreadOnly: boolean, streamId: string) => {
    streamIterator = entryIterator(unreadOnly, streamId);
    getStore().stream = {
        length: await entryCount(unreadOnly, streamId),
        loadedEntries: [],
    };
}

export const loadToEntry = async (index: number) => {
    const length = getStore().stream.length;

    if (index >= length || index < 0)
        return undefined;

    const loaded = {};
    const loadedIds = [];

    while (getStore().stream.loadedEntries.length <= index) {
        const next = await streamIterator.next();
        if (!next.value)
            break;

        loaded[next.value.id] = next.value;
        loadedIds.push(next.value.id);
    }

    getStore().entries = {
        ...getStore().entries,
        ...loaded
    };

    getStore().stream.loadedEntries = [
        ...getStore().stream.loadedEntries,
        ...loadedIds
    ];
}