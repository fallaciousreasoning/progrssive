import { useEffect, useMemo } from "react";
import { getEntry } from "../api/entry";
import { Entry } from "../model/entry";
import { addEntry, loadEntry } from "../services/db";
import { getStore, useStore } from "./store";

export const useStreamEntries = () => {
    const store = useStore();
    const loadedEntries = useMemo(() =>
        store.stream.loadedEntries.map(id => store.entries[id]),
        [store.stream, store.entries]);
    return loadedEntries;
}

export const useStreamEntry = (index: number) => {
    const store = useStore();
    if (store.stream.loadedEntries.length < index)
        return undefined;

    const id = store.stream.loadedEntries[index];
    return store.entries[id];
}

export const useEntry = (id: string) => {
    const store = useStore();

    useEffect(() => {
        if (!id || store.entries[id])
            return;

        const includeEntry = (e: Entry) => {
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
                    console.log(id, entry);
                    if (getStore().updating[id])
                        return;
                    getStore().updating[id] = true;
                    entry = await getEntry(id);
                    addEntry(entry);
                    getStore().updating[id] = false;
                }
                
                includeEntry(entry);
            });
    }, [id, store.entries]);

    return store.entries[id];
}
