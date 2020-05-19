import { Store } from "react-recollect";
import { getStore } from "../hooks/store";
import { updateStoreWithStream, updateSubscription, getSubscription, updateSubscriptions } from "../services/subscriptions";
import { StreamRequestOptions, getStream } from "../api/streams";

export const updateStreams = async () => {
    const subscriptions = getStore().subscriptions;
    for (const subscription of subscriptions) {
        await updateStream(subscription.id);
    }

    window.snackHelper.enqueueSnackbar("Updated subscriptions!");
}

export const updateStream = async (subscriptionId: string) => {
    // If there isn't a stream id, we should update all streams.
    if (!subscriptionId) {
        updateStreams();
        return;
    }

    if (getStore().updating.stream)
        return;

    getStore().updating.stream = true;

        try {
            await updateSubscription(subscriptionId);
        } catch (err) {
            console.error(subscriptionId, err);
            window.snackHelper.enqueueSnackbar(`Unabled to update ${getSubscription(subscriptionId).title}. Are you offline?`);
        }

    getStore().updating.stream = false;
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