import { getStore } from "../hooks/store";
import { updateProfile } from "./profile";
import { getEntry } from "../api/entry";

const fetching = {};

export const updateEntry = async (entryId: string) => {
    if (fetching[entryId]) return;
    fetching[entryId] = true;

    if (!getStore().profile)
        await updateProfile();

    const entry = await getEntry(entryId);
    const store = getStore();
    store.entries = {
        ...store.entries,
        [entryId]: entry
    };

    delete fetching[entryId];
}