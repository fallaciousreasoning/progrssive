import { useEffect, useMemo } from "react";
import { getEntry } from "../api/entry";
import { Entry } from "../model/entry";
import { addEntry, loadEntry } from "../services/db";
import { getStore, useStore } from "./store";
import { getStreamEntry } from '../selectors/entry';

export const useStreamEntries = () => {
    const store = useStore();
    const loadedEntries = useMemo(() =>
        store.stream.loadedEntries.map(id => store.entries[id]),
        [store.stream, store.entries]);
    return loadedEntries;
}

export const useStreamEntry = (index: number) => {
    const store = useStore();
    return getStreamEntry(store, index);
}

export const useEntry = (id: string) => {
    const store = useStore();

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
                        window.snackHelper.enqueueSnackbar('Unabled to load entry. Are you offline?')
                    }
                    getStore().updating[id] = false;
                }

                includeEntry(entry);
            });
    }, [id, store.entries]);

    return store.entries[id];
}
