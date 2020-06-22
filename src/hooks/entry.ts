import { EntryList } from "../services/entryIterator";
import { useState, useEffect } from "react";
import { Entry } from "../model/entry";

export const useLoadedEntry = (entryList: EntryList, index: number) => {
    const [entry, setEntry] = useState<Entry>(entryList.loadedAt(index));

    useEffect(() => {
        entryList.get(index).then(setEntry);
    }, [entryList, index]);

    return entry;
}