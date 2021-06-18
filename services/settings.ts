import { useLiveQuery } from 'dexie-react-hooks';
import { getDb } from "./db";
import { Settings } from '../model/settings';

export const defaultSettings: Settings = {
    markOpenedAsRead: true,
    markScrolledAsRead: true,
    doubleTapToCloseArticles: true,
    fontSize: 3,
    theme: 'device',
    accent: 'green',
    secondaryAccent: 'pink',
    fontFamily: 'Roboto',
    cleanupSettings: {
        deleteReadEntries: 7,
        deleteUnreadEntries: 'never'
    }
}

export const getSettings = async () => {
    const db = await getDb();
    const settings = await db.settings.where({ id: 'settings' }).first();
    return settings ?? defaultSettings;
}

export const useSettings = () => {
    return useLiveQuery(getSettings) ?? defaultSettings;
}

export const updateSettings = async (settings: Settings) => {
    const db = await getDb();
    if (!('id' in settings)) (settings as any).id = 'settings';
    db.settings.put(settings, 'settings');
}