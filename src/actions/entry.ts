import { getStore } from "../hooks/store";
import { getEntry } from "../api/entry";
import { addEntry, loadEntry } from "../services/db";
import { Entry } from "../model/entry";
import mobilize from "../services/mobilize";
import { getEntryUrl } from "../services/entry";

export const updateEntry = async (entryId: string) => {
    if (getStore().updating[entryId]) return;
    getStore().updating[entryId] = false;

    // If we aren't forcing network, try and load the entry from disk.
    // Fallback to fetching from the network.
    let entry: Entry = await loadEntry(entryId);
    if (!entry) {
        entry = await getEntry(entryId);
        // Ensure we write the entry to the disk.
        addEntry(entry, undefined, true);
    }

    delete getStore().updating[entryId];
}

export const loadMobilizedContent = async (entryId: string) => {
    if (getStore().updating[entryId]) return;
    getStore().updating[entryId] = true;

    let entry = getStore().entries[entryId];

    // If the entry wasn't in the store, load it from disk.
    if (!entry) {
        entry = await loadEntry(entryId).then(async e => {
            // If the entry wasn't on disk, try and load it from the network.
            if (!e) {
                e = await getEntry(entryId);
                await addEntry(e);
            }
            return e;
        });
        getStore().entries[entryId] = entry;
    }

    // Mobilize entry, if it isn't already.
    if (entry && !entry.mobilized) {
        try {
            const url = getEntryUrl(entry);
            const mobilizedContent = await mobilize(url);
            await addEntry({ id: entryId, mobilized: mobilizedContent });
            getStore().entries[entryId].mobilized = mobilizedContent;
        } catch (err) {
            window.snackHelper
                .enqueueSnackbar(`Failed to mobilize ${entry.title}. Are you offline?`);
            console.error(err);
        }
    }

    getStore().updating[entryId] = false;
}