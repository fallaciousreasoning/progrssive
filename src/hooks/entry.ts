import { useStore, getStore } from "./store";
import { useMemo, useState, useEffect } from "react";
import { loadEntry } from "../services/db";
import { Entry } from "../model/entry";
import { getEntry } from "../api/entry";

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

        const addEntry = (e: Entry) => {
            getStore().entries = {
                ...getStore().entries,
                [id]: e
            };
        }

        // Try and load the entry from the disk and
        // fallback to the network.
        loadEntry(id)
            .then(async entry => {
                if (getStore().updating[id])
                    return;

                if (!entry) {
                    getStore().updating[id] = true;
                    entry = await getEntry(id);
                    addEntry(entry);
                    getStore().updating[id] = false;
                }
                
                addEntry(entry);
            });
    }, [id, store.entries]);

    return store.entries[id];
}