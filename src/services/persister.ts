import localForage from 'localforage';
import { Store } from 'react-recollect';
import { getStore } from '../hooks/store';

(window as any)['localForage'] = localForage;

export const save = (key: string, value: object) => {
    return localForage.setItem(key, JSON.stringify(value));
}

export const saveChildren = (key: string, value: object) => {
    return localForage.getItem<string[]>(key)
        .then(async keys => new Set(await getChildKeys(key)))
        .then(keys => [
            ...Object.keys(value).map(k => {
                keys.add(k);
                return save(`${key}.${k}`, value[k])
            }),
            save(key, Array.from(keys))
        ]);
};

export const get = async (key: string) => JSON.parse(await localForage.getItem(key));

const getChildKeys = async (parentKey: string) => {
    const keys = await get(parentKey);
    return Array.isArray(keys) ? keys : [];
};

export const load = async (storeKey: keyof Store, defaultValue = undefined) => {
    const value = await get(storeKey) || defaultValue;
    getStore()[storeKey] = value;
    return value;
}