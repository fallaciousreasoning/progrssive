import { getStream } from "../api/streams";
import { getStore } from "../hooks/store";
import { Subscription } from "../model/subscription";
import { addStream } from "./db";
import { save } from "./persister";

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

export const toggleSubscription = (subscription: Subscription) => {
    const subscriptions = getStore().subscriptions;
    const index = subscriptions.findIndex(s => s.id === subscription.id);
    if (index !== -1) {
        const newSubs = [...subscriptions];
        newSubs.splice(index, 1);
        getStore().subscriptions = newSubs;
    } else {
        getStore().subscriptions = [
            ...subscriptions,
            subscription
        ];
    }

    return save('subscriptions', getStore().subscriptions);
}