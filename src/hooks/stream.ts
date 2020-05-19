import { useEffect } from "react";
import { Entry } from "../model/entry";
import { Stream } from "../model/stream";
import { useStore } from "./store";
import { executeOnce } from "./promise";

export const useStreams = () => {
    const store = useStore();

    return store.streams || {};
}

export const useStream = (streamId: string): Stream => {
    const store = useStore();
    if (!streamId) return;
    
    const streams = store.streams;

    // If it's a feed
    if (streamId.startsWith('feed/')) {
        return {
            id: streamId,
            items: Object.values(store.entries).filter(e => e.origin.streamId === streamId),
            title: 'Feed'
        };
    }

    // If it's a tag
    if (streamId.includes('/tag/')) {
        return {
            id: streamId,
            items: Object.values(store.entries).filter(e => e.tags && e.tags.some(t => t.id === streamId)),
            title: 'Tag'
        };
    }
    const stream = streams[streamId];

    return stream
        ? {
            ...stream,
            items: stream.items.map(i => store.entries[i])
        }
        : undefined;
}

export const useEntries = (): Entry[] => {
    const store = useStore();
    return Object.values(store.entries || {});
}

export const useEntry = (entryId: string): Entry => {
    const entries = useEntries();
    return entries[entryId];
}

export const useFeeds = (feedId: string): Entry[] => {
    const entries = useEntries();
    return entries.filter(e => e.origin.streamId === feedId);
}