import { store as s } from 'react-recollect';
import { bulkSetUnread } from '../actions/marker';
import { loadSettings } from '../actions/settings';
import { getStream } from '../api/streams';
import { getStore } from '../hooks/store';
import { Entry } from '../model/entry';
import { StoreDef } from '../types/RecollectStore';
import { entryCount, entryIterator } from './entryIterator';
import { loadStore } from './persister';
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
        id: undefined,
        unreadOnly: true,
        length: 0,
        lastScrollPos: 0,
        loadedEntries: []
    };

    store.entries = {};

    initStorePromise = loadStore();
    return initStorePromise;
}

let streamIterator: AsyncGenerator<Entry> = undefined;
export const setEntryList = async (unreadOnly: boolean, streamId: string, force = false) => {
    if (!force
        && unreadOnly === getStore().stream.unreadOnly
        && streamId === getStore().stream.id
        && getStore().stream.length !== 0) {
        return;
    }
    streamIterator = entryIterator(unreadOnly, streamId);
    getStore().stream = {
        id: streamId,
        unreadOnly,
        lastScrollPos: 0,
        length: 0,
        loadedEntries: [],
    };
    getStore().stream.length = await entryCount(unreadOnly, streamId);

    // Begin loading entries.
    loadToEntry(20);
}
window['setEntryList'] = setEntryList;

export const setTransientEntryList = async (streamId: string) => {
    if (getStore().stream.id === streamId)
        return;

    getStore().updating.stream++;
    getStore().stream = {
        id: streamId,
        lastScrollPos: 0,
        length: 1,
        loadedEntries: [],
        unreadOnly: false
    };

    const stream = await getStream(streamId).catch(() => null);
    if (!stream) {
        getStore().stream = {
            id: streamId,
            lastScrollPos: 0,
            length: 0,
            loadedEntries: [],
            unreadOnly: false
        };
        window.snackHelper.enqueueSnackbar(`Failed to load stream. Are you offline?`);
        return;
    }

    const entries = stream.items.reduce((prev, next) => {
        next.transient = true;
        prev[next.id] = next;
        return prev;
    }, {} as any);

    getStore().entries = {
        ...getStore().entries,
        ...entries
    };

    getStore().stream = {
        length: stream.items.length,
        id: streamId,
        unreadOnly: false,
        lastScrollPos: 0,
        loadedEntries: stream.items.map(s => s.id)
    };

    getStore().updating.stream--;
}

export const loadToEntry = async (index: number) => {
    if (index < 0)
        return;

    const loaded = {};
    const loadedIds = [];

    while (getStore().stream.loadedEntries.length <= index) {
        const next = await streamIterator.next();
        if (!next.value || next.done)
            break;

        loaded[next.value.id] = next.value;
        loadedIds.push(next.value.id);
    }

    if (loadedIds.length === 0)
        return;

    getStore().entries = {
        ...getStore().entries,
        ...loaded
    };

    getStore().stream.loadedEntries = [
        ...getStore().stream.loadedEntries,
        ...loadedIds
    ];
}

export const markStreamAs = async (status: 'read' | 'unread') => {
    const unreadStatus = status === 'unread';
    // Make sure we've loaded all the entries in the stream.
    await loadToEntry(getStore().stream.length);

    const entries = getStore()
        .stream
        .loadedEntries
        .filter(id => store.entries[id].unread == !unreadStatus)
    await bulkSetUnread(entries, unreadStatus);
}
