import { useEffect, useState } from 'react';
import { afterChange, store as defaultStore, Store } from 'react-recollect';
import { makeUpdatableSharedCache } from './promise';

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
    if (event.store === event.prevStore)
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

export const makeStoreCache = <T>(fetcher: (store: Store) => T | Promise<T>, onFetched: (store: Store, value: T) => void) => {
    const storeFetcher = async () => {
        const result = await fetcher(currentStore);
        onFetched(currentStore, result);
        return result;
    };

    const useCache = makeUpdatableSharedCache(storeFetcher);
    return (lastUpdate?: number) => {
        const cached = useCache(lastUpdate);
        return cached;
    }
}

export const getStreamUpdating = (streamId: string) => {
    const updating = getStore().updating.stream;
    if (!streamId)
        return updating.all;

    if (updating[streamId])
        return updating[streamId];

    if (updating.all)
        return updating.all;
}

window['up'] = getStreamUpdating