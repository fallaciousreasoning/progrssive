import { getStore } from "../hooks/store";
import { updateProfile } from "./profile";
import { getEntry } from "../api/entry";

export const updateEntry = async (entryId: string) => {
    if (getStore().updating[entryId]) return;
    getStore().updating[entryId] = false;

    if (!getStore().profile)
        await updateProfile();

    const entry = await getEntry(entryId);
    const store = getStore();
    store.entries = {
        ...store.entries,
        [entryId]: entry
    };

    delete store.updating[entryId];
}