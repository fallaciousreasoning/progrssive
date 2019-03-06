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

afterChange(event => {
    updaters.forEach(u => u(event.store));
});

export const useStore = () => {
    const [store, setStore] = useState(defaultStore);

    useEffect(() => {
        const updater = addUpdater(setStore);
        return () => {
            removeUpdater(updater);
        };
    });

    return store;
}