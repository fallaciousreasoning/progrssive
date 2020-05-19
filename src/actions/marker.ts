import { Entry } from "../model/entry";
import { saveEntry } from "../services/persister";

export const setUnread = async (entry: Entry, unread: boolean) => {
    entry.unread = unread;
    await saveEntry(entry);
}

export const setSaved = async (entry: Entry, saved: boolean) => {
    // const tagId = getSavedTag(profileId);
    // if (!saved) {
    //     entry.tags = entry.tags.filter(e => e.id !== tagId);
    // } else {
    //     entry.tags = [...(entry.tags || []), {
    //         id: tagId,
    //         label: 'Saved For Later'
    //     }];
    // }

    // await updateSaved(entry, saved);
    // await saveEntry(entry);
}