import { useEffect } from "react";
import { Store } from "react-recollect";
import { getEntry } from "../api/entry";
import { Entry } from "../model/entry";
import { addEntry, loadEntry } from "../services/db";
import { getStore } from "./store";

export const useEntry = (id: string, store: Store) => {
    useEffect(() => {
        if (!id || store.entries[id])
            return;

        const includeEntry = (e: Entry) => {
            if (!e)
                return;
            getStore().entries = {
                ...getStore().entries,
                [id]: e
            };
        }

        // Try and load the entry from the disk and
        // fallback to the network.
        loadEntry(id)
            .then(async entry => {
                if (!entry) {
                    if (getStore().updating[id])
                        return;
                    getStore().updating[id] = true;
                    try {
                        entry = await getEntry(id);
                        addEntry(entry);
                    } catch {
                        window.showToast('Unabled to load entry. Are you offline?')
                    }
                    getStore().updating[id] = false;
                }

                includeEntry(entry);
            });
    }, [id, store.entries]);

    return store.entries[id];
}
