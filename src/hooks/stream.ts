import { useEffect } from "react";
import { getStream } from "../api/streams";
import { Stream } from "../model/stream";
import { updateStream } from "../services/store";
import { useStore } from "./store";

export const useStream = (streamId: string): Stream => {
    const store = useStore();
    const stream = store.streams[streamId];

    // If we haven't cached the stream, get it from the internet.
    useEffect(() => {
        if (stream) return;
        getStream(streamId).then(updateStream);
    })

    return stream
        ? {
            ...stream,
            items: stream.items.map(i => store.entries[i])
        }
        : undefined;
}