import { store as s } from 'react-recollect';
import { bulkSetUnread } from '../actions/marker';
import { getStream } from '../feedly/streams';
import { getStore } from '../hooks/store';
import { Entry } from '../model/entry';
import { StoreDef } from '../types/RecollectStore';
import { entryCount, entryIterator, setScrollPos } from './entryIterator';
import { resolvable } from '../utils/promise';
import { getDb } from './db';
import 'types/Window';

const store = s as StoreDef;

export const initStore = () => {
    store.updating = {
        categories: false,
        stream: {},
    };

    setScrollPos(0);
    store.stream = {
        id: null,
        unreadOnly: true,
        length: undefined,
        loadedEntries: []
    };

    store.entries = {};
}

export const setStreamList = async (unreadOnly: boolean, streamId: string, force=false) => {
    const isTransient = streamId
        && !(await getDb()).subscriptions.get(streamId);
    if (isTransient)
        setTransientEntryList(streamId, force);
    else setEntryList(unreadOnly, streamId, force);
}

let streamIterator: AsyncGenerator<Entry>;
let currentLoader: (index: number) => Promise<void>;
const setEntryList = async (unreadOnly: boolean, streamId: string, force = false) => {
    if (!force
        && unreadOnly === getStore().stream.unreadOnly
        && streamId === getStore().stream.id) {
        return;
    }

    console.log("Made new entry iterator", streamId, unreadOnly, force)
    streamIterator = entryIterator(unreadOnly, streamId);
    currentLoader = makeLoader();
    
    setScrollPos(0);
    getStore().stream = {
        id: streamId,
        unreadOnly,
        length: undefined,
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

    setScrollPos(0);
    getStore().stream = {
        id: streamId,
        length: undefined,
        loadedEntries: [],
        unreadOnly: false
    };

    const stream = await getStream(streamId).catch(() => null);
    if (!stream) {
        getStore().stream.length = 0;
        window.showToast(`Failed to load stream. Are you offline?`);
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

    setScrollPos(0);
    getStore().stream = {
        length: stream.items.length,
        id: streamId,
        unreadOnly: false,
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
    // Collect the ids to update.
    const ids = new Set(getStore().stream.loadedEntries);
    const idsIterator = entryIterator(getStore().stream.unreadOnly, getStore().stream.id, 10000);
    for await (const entry of idsIterator)
        ids.add(entry.id);

    await bulkSetUnread(Array.from(ids), unreadStatus);
}
