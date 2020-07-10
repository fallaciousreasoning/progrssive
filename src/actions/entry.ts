import { getStore } from "../hooks/store";
import { getEntry } from "../api/entry";
import { addEntry, loadEntry } from "../services/db";
import { Entry } from "../model/entry";
import mobilize from "../services/mobilize";
import { getEntryUrl } from "../services/entry";

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
            getStore().updating[entryId] = false;
            console.error(err);
            throw err;
        }
    }

    getStore().updating[entryId] = false;
}