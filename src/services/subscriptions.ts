import { updateStreams } from "../actions/stream";
import { getStore } from "../hooks/store";
import { Subscription } from "../model/subscription";
import { getDb, saveSubscription } from "./db";
import { entryIterator } from "./entryIterator";
import { setStreamList } from "./store";
import { maybePerist } from "../utils/persist";

export const getSubscription = (id: string) => {
    const subscriptions = getStore().subscriptions;
    return subscriptions.find(s => s.id === id);
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

        // Reset the StreamList, so we don't try and iterate over deleted entries.
        setStreamList(getStore().stream.unreadOnly, getStore().stream.id, true);
    } else {
        // If we're adding a subscription, prompt the user
        // to enable persistence.
        maybePerist();

        getStore().subscriptions = [
            ...getStore().subscriptions,
            subscription
        ];

        subscription =
            getStore().subscriptions[getStore().subscriptions.length - 1];

        await saveSubscription(subscription);

        // Fetch articles for the subscription.
        await updateStreams(subscription.id);
    }
}