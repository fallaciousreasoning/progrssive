import { store as s } from 'react-recollect';
import { loadSettings } from '../actions/settings';
import { StoreDef } from '../types/RecollectStore';
import { loadStore } from './persister';
const store = s as StoreDef;

let initStorePromise: Promise<void>;
export const initStore = () => {
    if (initStorePromise)
        return initStorePromise;

    store.updating = {
        categories: false,
        stream: 0,
    };
    store.settings = loadSettings();
    store.current = {
    };
    store.subscriptions = [];

    initStorePromise = loadStore();
    return initStorePromise;
}