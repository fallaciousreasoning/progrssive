import { getStream } from "../api/streams";
import { getStore } from "../hooks/store";
import { Subscription } from "../model/subscription";
import { addStream } from "./db";

export const updateSubscriptions = async () => {
    const subscriptions = getStore().subscriptions;

    for (const subscription of subscriptions) {
        await updateSubscription(subscription);
    }
}

export const getSubscription = (id: string) => {
    const subscriptions = getStore().subscriptions;
    return subscriptions.find(s => s.id === id);
}

export const updateSubscription = async (subscription: Subscription | string) => {
    const subscriptionId = typeof subscription === "string" ? subscription : subscription.id;
    const stream = await getStream(subscriptionId);

    for (const entry of stream.items) {
        entry.streamIds = [subscriptionId];
    }

    await addStream(stream);
}