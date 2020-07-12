import { getStore } from "../hooks/store";
import { getAllEntries } from "../api/streams";
import { resolvable } from "../utils/promise";
import { saveSubscription, getDb, addEntry } from "../services/db";
import { copy } from "../utils/object";

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

    const lowestSince = Math.min(...affectedSubscriptions.map(s => s.lastSync));
    const fetchId = affectedSubscriptions.map(s => s.id).join(',');

    try {
        const syncDate = Date.now();
        const maxResults = affectedSubscriptions.length * 100;
        const entries = await getAllEntries(fetchId,
            lowestSince,
            maxResults,
            maxResults);


        for (const subscription of affectedSubscriptions) {
            subscription.lastSync = syncDate;
        }

        const db = await getDb();

        for (const entry of entries)
            addEntry(entry, true);

        await db.subscriptions.bulkPut(copy(affectedSubscriptions.map(s => ({
            ...s,
            lastSync: syncDate
        }))));

        window.snackHelper.enqueueSnackbar(`Fetched articles${streamId ? " for " + affectedSubscriptions[0] : ""}.`)
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
