import { getStore } from "../hooks/store";
import { getEntry } from "../api/entry";
import { loadEntry } from "../services/persister";
import { addEntry } from "../services/db";

export const updateEntry = async (entryId: string) => {
    if (getStore().updating[entryId]) return;
    getStore().updating[entryId] = false;

    // If we aren't forcing network, try and load the entry from disk.
    // Fallback to fetching from the network.
    let entry = await loadEntry(entryId);
    if (!entry) {
        entry = await getEntry(entryId);
        // Ensure we write the entry to the disk.
        addEntry(entry);
    }
    
    delete getStore().updating[entryId];
}