import { getAllEntries } from "../api/streams";
import { getStore } from "../hooks/store";
import { Subscription } from "../model/subscription";
import { resolvable } from "../utils/promise";
import { getDb, saveSubscription } from "./db";
import { entryIterator } from "./entryIterator";

export const getSubscription = (id: string) => {
    const subscriptions = getStore().subscriptions;
    return subscriptions.find(s => s.id === id);
}

export const updateSubscription = async (subscription: Subscription) => {
    const updatePromise = getStore().updating.stream[subscription.id];
    if (updatePromise)
        return updatePromise;

    const { resolve, promise } = resolvable();
    getStore().updating.stream[subscription.id] = promise;

    const lastSync = subscription.lastSync;

    // Update the store subscription. This won't propogate
    // unless we get the item from the store again, so
    // make a copy and update the last sync time on that
    // too.
    const syncDate = Date.now();
    subscription.lastSync = syncDate;
    subscription = { ...subscription };
    subscription.lastSync = syncDate;

    try {
        const entries = await getAllEntries(subscription.id, lastSync);

        for (const entry of entries) {
            if (!entry.origin)
                entry.origin = {} as any;

            if (entry.origin.streamId !== subscription.id)
                entry.origin.streamId = subscription.id;
        }

        await saveSubscription(subscription,
            entries);
    } catch (err) {
        delete getStore().updating.stream[subscription.id];
        resolve();
        throw err;
    }

    delete getStore().updating.stream[subscription.id];
    resolve();
}

const deleteSubscriptionData = async (id: string) => {
    const iterator = await entryIterator(false, id, 100);
    const toDelete = [];
    for await (const entry of iterator)
        toDelete.push(entry.id);

    const db = await getDb();
    await db.subscriptions.delete(id);
    await db.entries.bulkDelete(toDelete);
}

export const toggleSubscription = async (subscription: Subscription) => {
    const id = subscription.id;
    const index = getStore().subscriptions.findIndex(s => s.id === subscription.id);
    if (index !== -1) {
        subscription.deleting = true;

        const newSubs = [...getStore().subscriptions];
        newSubs.splice(index, 1);

        // Delete any entries associated with this subscription.
        await deleteSubscriptionData(id);

        subscription.deleting = false;
        getStore().subscriptions = newSubs;

    } else {
        getStore().subscriptions = [
            ...getStore().subscriptions,
            subscription
        ];

        subscription =
            getStore().subscriptions[getStore().subscriptions.length - 1];

        // Fetch articles for the subscription.
        try {
            await updateSubscription(subscription);
            window.snackHelper.enqueueSnackbar(`Fetched articles for ${subscription.title}`);
        } catch {
            window.snackHelper.enqueueSnackbar(`Failed to fetch ${subscription.title}`);
        }

        await saveSubscription(subscription);
    }
}