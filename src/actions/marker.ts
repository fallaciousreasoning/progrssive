import { Entry } from "../model/entry";
import { addEntry } from "../services/db";

export const setUnread = async (entry: Entry, unread: boolean) => {
    if (entry.unread === unread) return;
    
    entry.unread = unread;
    await addEntry(entry);
}
