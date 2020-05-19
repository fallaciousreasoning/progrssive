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

export const updateSubscription = async (subscription: Subscription) => {
    const stream = await getStream(subscription.id);
    await updateStoreWithStream(stream);
}

export const updateStoreWithStream = async (stream: Stream) => {
    const store = getStore();

    const entryUpdate: { [id: string]: Entry } = {};
    const streamUpdate = {
        [stream.id]: {
            ...stream,
            items: stream.items.map(i => i.id),
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