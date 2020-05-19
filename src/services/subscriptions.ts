import { Stream } from "../model/stream";
import { getStore } from "../hooks/store";
import { getStream } from "../api/streams";
import { Subscription } from "../model/subscription";
import { Entry } from "../model/entry";
import { saveChildren } from "./persister";

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
    await updateStoreWithStream(stream);
}

export const updateStoreWithStream = async (stream: Stream) => {
    const store = getStore();

    const entryUpdate: { [id: string]: Entry } = {};

    const oldItems = (store.streams[stream.id] && store.streams[stream.id].items) || [];
    const streamUpdate = {
        [stream.id]: {
            ...stream,
            items: Array.from(new Set([...stream.items.map(i => i.id), ...oldItems])),
            lastFetched: Date.now()
        }
    };

    for (const entry of stream.items) {
        const oldEntry = store.entries[entry.id];

        // Make sure we don't override the unread status.
        if (oldEntry) {
            entry.unread = oldEntry.unread;
            entry.readTime = oldEntry.readTime;
        }
        entryUpdate[entry.id] = entry;
    }

    store.entries = {
        ...store.entries,
        ...entryUpdate
    };

    store.streams = {
        ...getStore().streams,
        ...streamUpdate
    };

    await Promise.all([
        saveChildren('streams', streamUpdate),
        saveChildren('entries', entryUpdate)
    ]);
}