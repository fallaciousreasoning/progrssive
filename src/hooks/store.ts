import { useEffect, useState } from 'react';
import { afterChange, store as defaultStore, Store } from 'react-recollect';

type Updater = (store: Store) => void;

const updaters: Updater[] = [];
const addUpdater = (updater: Updater) => {
    updaters.push(updater);
    return updater;
}

const removeUpdater = (updater: Updater) => {
    const index = updaters.indexOf(updater);
    updaters.splice(index, 1);
}

let currentStore = defaultStore;
export const getStore = () => currentStore;
(window as any).getStore = getStore;

afterChange(event => {
    if (!event.changedProps.length)
      return;

    currentStore = event.store;
    updaters.forEach(u => u(event.store));
});

export const useStore = () => {
    const [store, setStore] = useState(defaultStore);

    useEffect(() => {
        const updater = addUpdater(setStore);
        return () => {
            removeUpdater(updater);
        };
    }, []);

    return store;
}

export const getStreamUpdating = (streamId: string) => {
    const updating = getStore().updating.stream;
    if (!streamId) {
        const values = Object.values(updating);
        if (values.length === 0)
            return;

        return Promise.all(values);
    }

    if (updating[streamId])
        return updating[streamId];
}
