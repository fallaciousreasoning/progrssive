import { getStore } from "../hooks/store";
import { updateSubscription } from "../services/subscriptions";

export const updateStreams = async (...streamIds: string[]) => {
    // Only use defined stream ids.
    streamIds = streamIds.filter(s => s);

    // If there aren't any, update everything.
    if (streamIds.length === 0)
        streamIds = getStore().subscriptions.map(s => s.id);

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

    getStore().lastUpdate = Date.now();

    if (failed)
        window.snackHelper.enqueueSnackbar("Failed to update subscriptions!");
    else
        window.snackHelper.enqueueSnackbar("Updated subscriptions!");
}
