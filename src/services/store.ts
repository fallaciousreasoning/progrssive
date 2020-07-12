import { store as s } from 'react-recollect';
import { bulkSetUnread } from '../actions/marker';
import { loadSettings } from '../actions/settings';
import { getStream } from '../api/streams';
import { getStore } from '../hooks/store';
import { Entry } from '../model/entry';
import { StoreDef } from '../types/RecollectStore';
import { entryCount, entryIterator } from './entryIterator';
import { getDb } from './db';
import { resolvable } from '../utils/promise';
const store = s as StoreDef;

let initStorePromise: Promise<void>;
export const initStore = () => {
    if (initStorePromise)
        return initStorePromise;

    store.updating = {
        categories: false,
        stream: {},
    };
    store.settings = loadSettings();
    store.current = {
    };
    store.subscriptions = [];

    store.stream = {
        id: undefined,
        unreadOnly: true,
        length: 0,
        lastScrollPos: 0,
        loadedEntries: []
    };

    store.entries = {};

    initStorePromise = getDb()
        .then(db => db.subscriptions.toArray())
        .then(subscriptions => {
            store.subscriptions = subscriptions;
        });
    return initStorePromise;
}

export const setStreamList = async (unreadOnly: boolean, streamId: string, force=false) => {
    await initStorePromise;

    const isTransient = !getStore().subscriptions.find(s => s.id === streamId);
    if (isTransient)
        setTransientEntryList(streamId, force);
    else setEntryList(unreadOnly, streamId, force);
}

let streamIterator: AsyncGenerator<Entry>;
let currentLoader: (index: number) => Promise<void>;
const setEntryList = async (unreadOnly: boolean, streamId: string, force = false) => {
    if (!force
        && unreadOnly === getStore().stream.unreadOnly
        && streamId === getStore().stream.id
        && getStore().stream.length !== 0) {
        return;
    }
    console.log("Set list", streamId)
    streamIterator = entryIterator(unreadOnly, streamId);
    currentLoader = makeLoader();
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

const setTransientEntryList = async (streamId: string, force=false) => {
    if (!force && getStore().stream.id === streamId)
        return;

    if (getStore().updating.stream[streamId]) {
        return getStore().updating.stream[streamId];
    }

    const { resolve, promise } = resolvable();
    getStore().updating.stream[streamId] = promise;
    streamIterator = undefined;
    currentLoader = undefined;
    getStore().stream = {
        id: streamId,
        lastScrollPos: 0,
        length: 0,
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
        
        resolve();
        delete getStore().updating.stream[streamId];
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

    resolve();
    delete getStore().updating.stream[streamId];
}

const makeLoader = () => {
    const iterator = streamIterator;
    const loadsQueue: {
        resolve: (value?: void) => void;
        index: number;
    }[] = [];

    const loadNEntries = async (n: number) => {
        if (n <= 0)
            return;
    
        const loaded = {};
        const loadedIds = [];
        const seen = new Set();
    
        while (loadedIds.length <= n) {
            const next = await iterator.next();
            if (iterator !== streamIterator)
                return;

            if (!next.value || next.done)
                break;
    
            loaded[next.value.id] = next.value;
            loadedIds.push(next.value.id);
            seen.add(next.value.id);
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

    let running = false;
    const run = async () => {
        running = true;

        while (loadsQueue.length > 0) {
            const current = loadsQueue.splice(0, 1)[0];
            const toLoad = current.index - getStore().stream.loadedEntries.length;
            if (toLoad <= 0) {
                current.resolve();
                continue;
            }
                
            await loadNEntries(toLoad);
            current.resolve();

            // This is no longer the loader.
            if (iterator !== streamIterator) {
                loadsQueue.forEach(l => l.resolve());
                return;
            }
        }

        running = false;
    };
    
    return (index: number) => {
        const { resolve, promise } = resolvable();
        loadsQueue.push({
            resolve,
            index
        });

        if (!running)
            run();
        return promise;
    }
}

export const loadToEntry = (index: number) => {
    if (!currentLoader)
        return;

    currentLoader(index);
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
