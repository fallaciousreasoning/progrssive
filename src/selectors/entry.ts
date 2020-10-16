import { Store } from "react-recollect";

export const getStreamEntries = (store: Store) => {
    return store.stream.loadedEntries.map(id => store.entries[id]);
}

export const getStreamEntry = (store: Store, index: number) => {
    if (store.stream.loadedEntries.length < index)
        return undefined;

    const id = store.stream.loadedEntries[index];
    return store.entries[id];
}