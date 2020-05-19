import { Store } from "react-recollect";
import { getStore } from "../hooks/store";
import { updateSubscriptions, updateSubscription, updateStoreWithStream } from "../services/subscriptions";
import { StreamRequestOptions, getStream } from "../api/streams";

export const updateStreams = async (streamId?: string, thenSync: boolean = false) => {
    streamId = streamId;
    if (!streamId)
        throw new Error("Empty stream id!");
    if (getStore().updating[streamId]) return;
    getStore().updating[streamId] = true;

    try {
        const stream = await getStream(streamId, 'contents');

        // TODO: We should have a better set all streams method.
        updateStoreWithStream(stream);

        // Maybe update all streams in the background.
        if (thenSync)
            getAllUnread(streamId);
    } catch (error) {
        window.snackHelper.enqueueSnackbar("Unable to update stream. You appear to be offline.")
    }
    getStore().updating[streamId] = false;
}

export const getAllUnread = async (streamId: string, continuation: string = undefined) => {
    try {
        do {
            const options: StreamRequestOptions = {
            };
            if (continuation)
                options.continuation = continuation;

            const stream = await getStream(streamId, 'contents', options);

            // Next time, start from here.
            continuation = stream.continuation;
            updateStoreWithStream(stream);
        } while (continuation);
    } catch (error) {
        window.snackHelper.enqueueSnackbar('Background update failed.');
    }

    window.snackHelper.enqueueSnackbar('Background sync complete.');
}