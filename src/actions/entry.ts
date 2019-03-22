import { getStore } from "../hooks/store";
import { updateProfile } from "./profile";
import { getEntry } from "../api/entry";

export const updatingEntry = (entryId: string) => getStore().updating.entries[entryId];

export const updateEntry = async (entryId: string) => {
    if (updatingEntry(entryId)) return;
    getStore().updating.entries[entryId] = false;

    if (!getStore().profile)
        await updateProfile();

    const entry = await getEntry(entryId);
    const store = getStore();
    store.entries = {
        ...store.entries,
        [entryId]: entry
    };

    delete store.updating.entries[entryId];
}