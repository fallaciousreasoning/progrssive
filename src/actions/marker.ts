import { Entry } from "../model/entry";
import { addEntry } from "../services/db";
import { getStore } from "../hooks/store";

export const setUnread = async (entry: Entry | string, unread: boolean) => {
    const id = typeof entry === "string"
        ? entry
        : entry.id;

    const storeEntry = getStore().entries[id];
    const readTime = Date.now();

    if (storeEntry) {
        if (storeEntry.unread === unread)
            return;

        storeEntry.unread = unread;
        storeEntry.readTime = readTime;
    }

    await addEntry({
        id: id,
        unread: unread,
        readTime: readTime
    });
}
