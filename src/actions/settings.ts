import { getStore } from "../hooks/store";
import { debounce } from "../services/debounce";
import { Settings } from "../types/RecollectStore";
import { getColor } from "../theme";

const defaultSettings: Settings = {
    markOpenedAsRead: true,
    markScrolledAsRead: true,
    doubleTapToCloseArticles: true,
    fontSize: 3,
    theme: 'device',
    accent: 'green',
    secondaryAccent: 'pink',
    fontFamily: 'Roboto'
}

const saveSettings = (settings: Settings) => {
    window.localStorage.setItem('settings', JSON.stringify(settings));
    console.log('saved settings!');
}
const debouncedSaveSettings = debounce(saveSettings, 1000);

export const updateSettings = <T extends keyof Settings>(name: T, value: Settings[T]) => {
    getStore().settings[name] = value;
    debouncedSaveSettings(getStore().settings);
}

export const loadSettings = () => {
    const json = window.localStorage.getItem('settings');
    return json ? JSON.parse(json) as Settings : defaultSettings;
}