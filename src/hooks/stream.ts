import { useEffect } from "react";
import { getStream, getAllStreams } from "../api/streams";
import { Entry } from "../model/entry";
import { Stream } from "../model/stream";
import { updateStream, updateAllStreams } from "../services/store";
import { useStore } from "./store";
import { executeOnce } from "./promise";
import { useProfile } from "./profile";

export const useStream = (streamId: string): Stream => {
    const store = useStore();
    const profile = useProfile();
    const stream = store.streams[streamId];

    // If we haven't cached the stream, get it from the internet.
    executeOnce((profileId) => {
        if (!profileId) return;

        return getAllStreams(profileId).then(streams => updateAllStreams(profileId, streams));
    }, profile && profile.id);

    return stream
        ? {
            ...stream,
            items: stream.items.map(i => store.entries[i])
        }
        : undefined;
}

export const useEntry = (entryId: string): Entry => {
    const store = useStore();
    const entry = store.entries[entryId];

    // TODO Load the stream from feedly if we don't have it.

    return entry;
}