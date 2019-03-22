import localForage from 'localforage';
export const save = (key: string, value: object) => {
    return localForage.setItem(key, JSON.stringify(value));
}

export const saveChildren = (key: string, value: object) => {
    return Object.keys(value).map(k => save(`${key}.${k}`, value[k]));
}