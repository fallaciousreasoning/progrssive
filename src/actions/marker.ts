import { Entry } from "../model/entry";
import { saveEntry } from "../services/persister";

export const setUnread = async (entry: Entry, unread: boolean) => {
    entry.unread = unread;
    await saveEntry(entry);
}
