import { Stream } from "../model/stream";
import { getStore } from "../hooks/store";
import { getStream } from "../api/streams";
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
    const stream = await getStream(typeof subscription === "string" ? subscription : subscription.id);
    await addStream(stream);
}