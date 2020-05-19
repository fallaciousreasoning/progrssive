import { Entry } from "../model/entry";
import { saveEntry } from "../services/persister";

export const setUnread = async (entry: Entry, unread: boolean) => {
    if (entry.unread === unread) return;
    
    entry.unread = unread;
    await saveEntry(entry);
}
