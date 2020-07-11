import { getAllEntries } from "../api/streams";
import { getStore } from "../hooks/store";
import { Subscription } from "../model/subscription";
import { getDb, saveSubscription } from "./db";
import { entryIterator } from "./entryIterator";

export const getSubscription = (id: string) => {
    const subscriptions = getStore().subscriptions;
    return subscriptions.find(s => s.id === id);
}

export const updateSubscription = async (subscription: Subscription) => {
    const syncDate = Date.now();
    const entries = await getAllEntries(subscription.id, subscription.lastSync);

    for (const entry of entries)
        entry.streamIds = [subscription.id];

    subscription.lastSync = syncDate;
    await saveSubscription(subscription,
        entries);
}

const deleteSubscriptionData = async (id: string) => {
    const iterator = await entryIterator(false, id, 100);
    const toDelete = [];
    for await (const entry of iterator) {
        if (entry.streamIds.length > 1)
            continue;
        toDelete.push(entry.id);
    }

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