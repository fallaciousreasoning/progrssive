import { getStore } from "../hooks/store";
import { updateSubscription } from "../services/subscriptions";
import { resolvable } from "../utils/promise";

export const updateStreams = async (...streamIds: string[]) => {
    if (getStore().updating.stream.all)
        return getStore().updating.stream.all;

    // Only use defined stream ids.
    streamIds = streamIds.filter(s => s);

    // If there aren't any, update everything.
    if (streamIds.length === 0)
        streamIds = getStore().subscriptions.map(s => s.id);
    
    const {resolve, promise} = resolvable();
    getStore().updating.stream.all = promise;

    let failed = false;
    const updates = streamIds.map(async id => {
        try {
            const subscription = getStore().subscriptions.find(s => s.id === id);
            await updateSubscription(subscription);
        } catch (err) {
            console.error(err);
            failed = true;
        }
    });

    await Promise.all(updates);

    delete getStore().updating.stream.all;
    getStore().lastUpdate = Date.now();
    resolve();

    if (failed)
        window.snackHelper.enqueueSnackbar("Failed to update subscriptions!");
    else
        window.snackHelper.enqueueSnackbar("Updated subscriptions!");
}
