import { getStream, StreamRequestOptions } from "../api/streams";
import { getStore } from "../hooks/store";
import { addStream } from "../services/db";
import { updateSubscription } from "../services/subscriptions";

export const updateStreams = async (...streamIds: string[]) => {
    // Only use defined stream ids.
    streamIds = streamIds.filter(s => s);

    // If there aren't any, update everything.
    if (streamIds.length === 0)
        streamIds = getStore().subscriptions.map(s => s.id);
    
    getStore().updating.stream = streamIds.length;

    let failed = false;
    for (const streamId of streamIds) {
        try {
            await updateSubscription(streamId);
        } catch (err) {
            console.log(err);
            failed = true;
        }
        getStore().updating.stream--;
    }

    getStore().lastUpdate = Date.now();

    if (failed)
        window.snackHelper.enqueueSnackbar("Failed to update subscriptions!");
    else
        window.snackHelper.enqueueSnackbar("Updated subscriptions!");
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
            addStream(stream);
        } while (continuation);
    } catch (error) {
        window.snackHelper.enqueueSnackbar('Background update failed.');
    }

    window.snackHelper.enqueueSnackbar('Background sync complete.');
}