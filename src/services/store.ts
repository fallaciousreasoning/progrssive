import { store as s } from 'react-recollect';
import { Stream } from '../model/stream';
import { Subscription } from '../model/subscription';
import { StoreDef, StoreStream } from '../types/RecollectStore';
import { Entry } from '../model/entry';
import { getUncategorizedId, getSavedId, getAllId } from '../api/streams';
import { getStore } from '../hooks/store';
import { saveChildren, loadStore } from './persister';
import { loadSettings } from '../actions/settings';
import { loadProfile } from '../actions/profile';
const store = s as StoreDef;
 
export const initStore = () => {
    store.streams = {};
    store.entries = {};
    store.updating = {
        categories: false,
        profile: false,
    };
    store.settings = loadSettings();
    store.current = {
    };

    loadStore();

    // Include our fake stream by default.
    // setAllStreams(store.profile.id, require('../fakeStream.json'));
    // store.collections = require('../fakeCollections.json');
}

export const setStream = (stream: Stream) => {
    const entryUpdate = stream.items.reduce((prev, next) => ({
        ...prev,
        [next.id]: next
    }), {});

    store.entries = {
        ...store.entries,
        ...entryUpdate
    };

    store.streams[stream.id] = {
        ...stream,
        items: stream.items.map(i => i.id),
        lastFetched: Date.now()
    };
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

export const getTaggedEntriesAsStream = (tag: string): Stream => {
    const store = getStore();
    return {
        id: tag,
        title: tag,
        items: Object.values(store.entries)
            .filter(e => e.unread || !store.settings.unreadOnly)
    }
}

export const setAllStreams = (profileId: string, allStream: Stream) => {
    const uncategorizedId = getUncategorizedId(profileId);
    const savedId = getSavedId(profileId);

    const entryUpdate: { [id: string]: Entry } = {};
    const streamUpdate = {
        [allStream.id]: {
            ...allStream,
            items: allStream.items.map(i => i.id),
            lastFetched: Date.now()
        },
        [uncategorizedId]: {
            id: uncategorizedId,
            title: "Uncategorized",
            items: [],
            lastFetched: 0
        },
        [savedId]: {
            id: savedId,
            title: "Saved for later",
            items: [],
            lastFetched: 0
        }
    };

    for (const entry of allStream.items) {
        entryUpdate[entry.id] = entry;

        // Add to uncategorized.
        if (!entry.categories || entry.categories.length === 0) {
            streamUpdate[uncategorizedId].items.push(entry.id);
            continue;
        }
        
        // Add to all categories we pretend to have.
        for (const category of entry.categories) {
            // If we haven't made a stream for this category, create one.
            if (!streamUpdate[category.id]) {
                const oldStream = store.streams[category.id];

                streamUpdate[category.id] = {
                    id: category.id,
                    title: category.label,
                    items: [...(oldStream ? oldStream.items : [])],
                    lastFetched: oldStream ? oldStream.lastFetched : 0
                }
            }

            streamUpdate[category.id].items.push(entry.id);
        }
    }

    // Deduplicate items.
    for (const category of Object.values(streamUpdate)) {
        category.items = Array.from(new Set(category.items));
    }

    store.entries = {
        ...store.entries,
        ...entryUpdate
    };

    store.streams = {
        ...store.streams,
        ...streamUpdate
    }

    Promise.all([
        saveChildren('streams', streamUpdate),
        saveChildren('entries', entryUpdate)
    ]);
}

const ensureStream = (id: string, title: string, on: { [id: string]: StoreStream }) => {
    if (on[id])
      return;

    on[id] = {
        id: id,
        title: title,
        items: [],
        lastFetched: 0
    }
};

export const updateWithStream = async (stream: Stream) => {
    const profile = await loadProfile();
    const store = getStore();

    const allId = getAllId(profile.id);
    const savedId = getSavedId(profile.id);
    const uncategorizedId = getUncategorizedId(profile.id);

    const newStreams = { ...store.streams };
    const newEntries = {};

    ensureStream(allId, "All", newStreams);
    ensureStream(savedId, "Saved for later", newStreams);
    ensureStream(uncategorizedId, "Uncategorized", newStreams);

    for (const entry of stream.items) {
        newEntries[entry.id] = entry;

        // Add to all.
        newStreams[allId].items.push(entry.id);

        // Maybe add to uncategorized.
        if (!entry.categories || entry.categories.length === 0) {
            newStreams[uncategorizedId].items.push(entry.id);
            continue;
        }

        // Add the entry to each category it says it belongs to.
        for (const category of entry.categories) {
            ensureStream(category.id, category.label, newStreams);
            newStreams[category.id].items.push(entry.id);
        }
    }

    // Deduplicate.
    for (const category of Object.values(newStreams))
        category.items = Array.from(new Set(category.items));
    
    // Update the store.
    getStore().streams = newStreams;
    getStore().entries = {
        ...getStore().entries,
        ...newEntries
    };

    // Save to disk.
    Promise.all([
        saveChildren('streams', getStore().streams),
        saveChildren('entries', getStore().entries)
    ]);
};