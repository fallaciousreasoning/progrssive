import { updateStreams } from "../actions/stream";
import { getStore } from "../hooks/store";
import { Subscription } from "../model/subscription";
import { getDb, saveSubscription } from "./db";
import { entryIterator } from "./entryIterator";
import { setStreamList } from "./store";
import { getFeed } from "../api/search";
import { useLiveQuery } from "dexie-react-hooks";
import { maybePersist } from '../utils/persist';
// Get the subscription from our store or fetch it from Feedly, if we don't have
// it.
export const findSubscription = async (id: string) => {
    return await getSubscription(id) || await getFeed(id);
}

export const getSubscription = async (id: string) => {
    return subscriptionsQuery.then(s => s.where({ id }).first());
}
export const useSubscription = (id: string) => {
    return useLiveQuery(() => getSubscription(id), [id]);
}

export const subscriptionsQuery = getDb().then(db => db.subscriptions);

const deleteSubscriptionData = async (id: string) => {
    const iterator = await entryIterator(false, id, 100);
    const toDelete = [];
    for await (const entry of iterator)
        toDelete.push(entry.id);

    const db = await getDb();
    await db.subscriptions.delete(id);
    await db.entries.bulkDelete(toDelete);
}

export const toggleSubscription = async (subscriptionPromise: Subscription | Promise<Subscription>) => {
    const subscription = await subscriptionPromise;

    const id = subscription.id;
    const existing = await getSubscription(id);
    if (existing) {
        // Delete any entries associated with this subscription.
        await deleteSubscriptionData(id);

        // Reset the StreamList, so we don't try and iterate over deleted entries.
        setStreamList(getStore().stream.unreadOnly, getStore().stream.id, true);
    } else {
        // If we're adding a subscription, prompt the user
        // to enable persistence.
        maybePersist();

        await saveSubscription(subscription);

        // Fetch articles for the subscription.
        await updateStreams(subscription.id);
    }
}