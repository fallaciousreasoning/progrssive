import { useEffect } from "react";
import { getStream, getAllStreams } from "../api/streams";
import { Entry } from "../model/entry";
import { Stream } from "../model/stream";
import { updateStream, updateAllStreams } from "../services/store";
import { useStore } from "./store";
import { executeOnce } from "./promise";
import { useProfile } from "./profile";

export const useStreams = () => {
    const store = useStore();
    const profile = useProfile();

    const streams = store.streams;

    // If we haven't the streams, get them from the internet.
    executeOnce((profileId) => {
        if (!profileId) return;

        return getAllStreams(profileId).then(streams => updateAllStreams(profileId, streams));
    }, profile && profile.id);

    return streams;
}

export const useStream = (streamId: string): Stream => {
    const store = useStore();
    const streams = useStreams();

    // If it's a feed
    if (streamId.startsWith('feed/')) {
        console.log(streamId)
        return {
            id: streamId,
            items: Object.values(store.entries).filter(e => e.origin.streamId === streamId),
            title: 'Foo'
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
    useStreams();

    return Object.values(store.entries);
}

export const useEntry = (entryId: string): Entry => {
    const store = useStore();
    useStreams();

    return store.entries[entryId];
}

export const useFeeds = (feedId: string): Entry[] => {
    const entries = useEntries();
    return entries.filter(e => e.origin.streamId === feedId);
}