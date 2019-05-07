import { Entry } from "../model/entry";
import { updateUnread, updateSaved } from "../api/markers";
import { getSavedId as getSavedTag } from "../api/streams";
import { saveEntry } from "../services/persister";

export const setUnread = async (entry: Entry, unread: boolean) => {
    entry.unread = unread;
    await updateUnread(entry, entry.unread);
    await saveEntry(entry);
}

export const setSaved = async (entry: Entry, saved: boolean, profileId: string) => {
    const tagId = getSavedTag(profileId);
    if (!saved) {
        entry.tags = entry.tags.filter(e => e.id !== tagId);
    } else {
        entry.tags = [...(entry.tags || []), {
            id: tagId,
            label: 'Saved For Later'
        }];
    }

    await updateSaved(entry, saved);
    await saveEntry(entry);
}