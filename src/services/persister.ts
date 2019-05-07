import localForage from 'localforage';
import { Store } from 'react-recollect';
import { getStore } from '../hooks/store';
import { Entry } from '../model/entry';

(window as any)['localForage'] = localForage;

export const entriesPrefix: keyof Store = 'entries';

export const save = (key: string, value: object) => {
    return localForage.setItem(key, JSON.stringify(value));
}

export const saveEntry = (entry: Entry) => {
    return save(`${entriesPrefix}.${entry.id}`, entry);
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

const get = async (key: string) => JSON.parse(await localForage.getItem(key));

const getChildKeys = async (parentKey: string) => {
    const keys = await get(parentKey);
    return Array.isArray(keys) ? keys : [];
};

const batchedLoad = async (storeKey: keyof Store, batchSize = 20) => {
    const keys = await getChildKeys(storeKey);
    for (let i = 0; i < keys.length; i += batchSize) {
        const results = await Promise.all(keys.slice(i, Math.min(i + batchSize, keys.length))
            .map(key => get(`${storeKey}.${key}`)));
        getStore()[storeKey] = {
            ...getStore()[storeKey],
            ...results.reduce((prev, next) => ({ ...prev, [(next as any).id]: next }), {})
        };
    }
}

export const load = async (storeKey: keyof Store) => {
    const value = await get(storeKey);
    getStore[storeKey] = value;
    return value;
}

export const loadEntry = (id: string): Promise<Entry> => get(`${entriesPrefix}.${id}`) as Promise<Entry>;

export const loadStore = async () => {
    await Promise.all([
        batchedLoad('entries'),
        batchedLoad('streams')
    ]);
}