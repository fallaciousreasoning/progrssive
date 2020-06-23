import { useEffect } from "react";
import { loadToEntry } from "../services/store";
import { useStore } from "./store";

export const useLoadedEntries = () => {
    const store = useStore();
    return store.entries.loadedEntries;
}

export const useLoadedEntry = (index: number) => {
    const loadedEntries = useLoadedEntries();
    
    useEffect(() => {
        loadToEntry(index);
    }, [loadedEntries, index])

    return index < loadedEntries.length
        ? loadedEntries[index]
        : undefined;
}