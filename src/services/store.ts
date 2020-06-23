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

    store.entries = {
        length: 0,
        loadedEntries: []
    };

    initStorePromise = loadStore();
    return initStorePromise;
}

let iterator: AsyncGenerator<Entry> = undefined;
export const setEntryList = async (unreadOnly: boolean, streamId: string) => {
    iterator = entryIterator(unreadOnly, streamId);
    getStore().entries = {
        length: await entryCount(unreadOnly, streamId),
        loadedEntries: [],
    };
}

export const loadToEntry = async (index: number) => {
    const length = getStore().entries.length;

    if (index >= length || index < 0)
        return undefined;

    while (getStore().entries.loadedEntries.length <= index) {
        const next = await iterator.next();
        if (!next.value)
            break;

        getStore().entries.loadedEntries = [
            ...getStore().entries.loadedEntries,
            next.value
        ];
    }

    return getStore().entries.loadedEntries[index];
}