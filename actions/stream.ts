import { getAllEntries } from "../api/streams";
import { getStore } from "../hooks/store";
import { Subscription } from "../model/subscription";
import { bulkUpdateEntries, getDb } from "../services/db";
import { copy } from "../utils/object";
import { resolvable } from "../utils/promise";

export const updateStreamsHeadless = async (subscriptions: Subscription[]) => {
    if (!subscriptions.length)
        return;

    const lowestSync = Math.min(...subscriptions.map(s => s.lastSync));
    const fetchId = subscriptions.map(s => s.id).join(',');

    const syncDate = Date.now();
    const maxResults = subscriptions.length * 250;
    const entries = await getAllEntries(fetchId,
        lowestSync,
        maxResults,
        maxResults);

    for (const subscription of subscriptions) {
        subscription.lastSync = syncDate;
    }

    await bulkUpdateEntries(entries);

    const db = await getDb();
    await db.subscriptions.bulkPut(copy(subscriptions.map(s => ({
        ...s,
        lastSync: syncDate
    }))));
}

export const updateStreams = async (streamId?: string) => {
    const affectedSubscriptions = (!streamId
        // If there is no stream id, try and update everything.
        ? getStore().subscriptions
        // Otherwise, only try and update the specific stream.
        : getStore().subscriptions.filter(s => s.id === streamId))

        // But only the ones that aren't already being updated.
        .filter(s => !getStore().updating.stream[s.id]);

    if (!affectedSubscriptions.length)
        return;

    // Let the store know what's being updated.
    const { promise, resolve } = resolvable();
    getStore().updating.stream = affectedSubscriptions.reduce((prev, next) => ({
        ...prev,
        [next.id]: promise
    }), { ...getStore().updating.stream });

    try {
        await updateStreamsHeadless(affectedSubscriptions);
        window.snackHelper.enqueueSnackbar(`Fetched articles${streamId ? " for " + (affectedSubscriptions[0].title || "").trim() : ""}.`)
    } catch {
        window.snackHelper.enqueueSnackbar(`Failed to update ${streamId ? affectedSubscriptions[0].title : "Stream"}`);
    }

    // Let the store know we're done with our update.
    const updatingStreams = {
        ...getStore().updating.stream
    };
    for (const s of affectedSubscriptions)
        delete updatingStreams[s.id];
    getStore().updating.stream = updatingStreams;
    resolve();
}
