import { getStore } from "../hooks/store";
import { getEntry } from "../api/entry";
import { loadEntry } from "../services/persister";

export const updateEntry = async (entryId: string, force: boolean = false) => {
    if (getStore().updating[entryId]) return;
    getStore().updating[entryId] = false;

    // If we aren't forcing network, try and load the entry from disk.
    // Fallback to fetching from the network.
    const entry = (!force && await loadEntry(entryId))
        || await getEntry(entryId);
        
    const store = getStore();
    store.entries = {
        ...store.entries,
        [entryId]: entry
    };

    delete store.updating[entryId];
}