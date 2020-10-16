import { store } from "react-recollect";

export const getStreamEntries = () => {
    return store.stream.loadedEntries.map(id => store.entries[id]);
}

export const getStreamEntry = (index: number) => {
    if (store.stream.loadedEntries.length < index)
        return undefined;

    const id = store.stream.loadedEntries[index];
    return store.entries[id];
}