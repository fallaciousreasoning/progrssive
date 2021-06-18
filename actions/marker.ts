import { getStore } from "../hooks/store";
import { Entry } from "../model/entry";
import { getDb } from "../services/db";

export const bulkSetUnread = async (entries: string[], unread: boolean) => {
    const entriesUpdate = {};
    const readTime = Date.now();

    // Calculate the store update.
    for (const id of entries) {
        const storeEntry = getStore().entries[id];
        if (!storeEntry)
            continue;

        // Nothing to update.
        if (storeEntry.unread === unread)
            continue;

        entriesUpdate[id] = {
            ...storeEntry,
            unread,
            readTime,
        };
    }

    // Update the store.
    getStore().entries = {
        ...getStore().entries,
        ...entriesUpdate
    };

    const db = await getDb();
    const onDisk = await db.entries.bulkGet(entries);
    const update = onDisk.map(e => ({
        ...e,
        unread: +unread,
        readTime
    }));
    await db.entries.bulkPut(update);
}

export const setUnread = async (entry: Entry | string, unread: boolean) => {
    const id = typeof entry === "string"
        ? entry
        : entry.id;

    return bulkSetUnread([id], unread);
}
