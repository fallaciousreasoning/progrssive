import { getColorForTheme } from '@/styles/colors';
import { fonts, themeMeta } from '@/styles/theme';
import { useLiveQuery } from 'dexie-react-hooks';
import { Settings } from '../model/settings';
import { getDb } from "./db";

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

const getLocalStorageSettings = () => JSON.parse(globalThis?.localStorage?.getItem('settings') ?? null) as Settings;

export const getSettings = async () => {
    const db = await getDb();
    const settings = await db.settings.where({ id: 'settings' }).first();
    return settings ?? defaultSettings;
}

export const useSettings = () => {
    return useLiveQuery(getSettings)
        ?? getLocalStorageSettings()
        ?? defaultSettings;
}

export const updateSettings = async (settings: Settings) => {
    const db = await getDb();
    if (!('id' in settings)) (settings as any).id = 'settings';
    db.settings.put(settings, 'settings');
    localStorage.setItem('settings', JSON.stringify(settings));
}

const themeMediaQuery = globalThis.matchMedia?.('(prefers-color-scheme: dark)');
export const updateCssVariables = (settings?: Settings) => {
    settings = settings ?? getLocalStorageSettings();

    let theme = settings.theme;
    if (theme == 'device') theme = themeMediaQuery.matches ? 'dark' : 'light'

    const primaryColor = getColorForTheme(settings.accent, theme);
    const secondaryColor = getColorForTheme(settings.secondaryAccent, theme);

    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--primary-color', primaryColor);
    rootStyle.setProperty('--secondary-color', secondaryColor);
    rootStyle.setProperty('--font-family', fonts[settings.fontFamily]);
    rootStyle.setProperty('--font-size', settings.fontSize as any);
}