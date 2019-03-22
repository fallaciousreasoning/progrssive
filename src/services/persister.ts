import localForage from 'localforage';
import { Store } from 'react-recollect';
import { getStore } from '../hooks/store';

export const save = (key: string, value: object) => {
    return localForage.setItem(key, JSON.stringify(value));
}

export const saveChildren = (key: string, value: object) => {
    return localForage.getItem<string[]>(key)
        .then(keys => new Set(Array.isArray(keys) ? keys : []))
        .then(keys => [
        ...Object.keys(value).map(k => {
            keys.add(k);
            return save(`${key}.${k}`, value[k])
        }),
        save(key, Array.from(keys))
    ]);
};

const getChildKeys = async (parentKey: string) => {
    const keys = await localForage.getItem<string[]>(parentKey);
    return Array.isArray(keys) ? keys : [];
};

const batchedLoad = async (storeKey: keyof Store, batchSize = 20) => {
    const keys = await getChildKeys(storeKey);

    for (let i = 0; i < keys.length; i += batchSize) {
        const results = await Promise.all(keys.slice(i, Math.min(i + batchSize, keys.length)).map(key => localForage.getItem(`${storeKey}.${key}`)));
        getStore()[storeKey] = {
            ...getStore()[storeKey],
            ...(results as any)
        };
    }
}

export const loadStore = async () => {
    batchedLoad('entries');
    batchedLoad('streams');
}