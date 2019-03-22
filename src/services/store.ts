import { store as s } from 'react-recollect';
import { Stream } from '../model/stream';
import { Subscription } from '../model/subscription';
import { StoreDef, StoreStream } from '../types/RecollectStore';
import { Entry } from '../model/entry';
import { getUncategorizedId } from '../api/streams';
import { getStore } from '../hooks/store';
import { saveChildren } from './persister';
const store = s as StoreDef;
 
export const initStore = () => {
    store.streams = {};
    store.entries = {};
    store.profile = require('../fakeProfile.json');
    store.updating = {
        categories: false,
        entries: {},
        streams: {},
        profile: false,
    };
    store.settings = {
        unreadOnly: true
    }

    // Include our fake stream by default.
    setAllStreams(store.profile.id, require('../fakeStream.json'));
    store.collections = require('../fakeCollections.json');
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
        items: stream.items.map(i => store.entries[i]).filter(e => e.unread || !store.settings.unreadOnly)
    };
}

export const setAllStreams = (profileId: string, allStream: Stream) => {
    const uncategorizedId = getUncategorizedId(profileId);
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
                    items: [],
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
        ...saveChildren('streams', streamUpdate),
        ...saveChildren('entries', entryUpdate)
    ]);
}