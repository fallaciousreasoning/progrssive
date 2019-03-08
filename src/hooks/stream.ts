import { useEffect } from "react";
import { getStream } from "../api/streams";
import { Entry } from "../model/entry";
import { Stream } from "../model/stream";
import { updateStream } from "../services/store";
import { useStore } from "./store";
import { executeOnce } from "./promise";

export const useStream = (streamId: string): Stream => {
    const store = useStore();
    const stream = store.streams[streamId];

    // If we haven't cached the stream, get it from the internet.
    executeOnce(() => !stream && getStream(streamId).then(updateStream));

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