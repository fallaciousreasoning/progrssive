import { AccentColor } from "styles/colors";

export interface CleanupSettings {
    deleteReadEntries: 'never' | 1 | 3 | 7 | 14 | 21 | 28;
    deleteUnreadEntries: 'never' | 1 | 3 | 7 | 14 | 21 | 28;
}

export interface Settings {
    markOpenedAsRead: boolean;
    markScrolledAsRead: boolean;
    doubleTapToCloseArticles: boolean;
    fontSize: 1 | 2 | 3 | 4 | 5;
    theme: 'light' | 'dark' | 'device';
    accent: AccentColor;
    secondaryAccent: AccentColor;
    fontFamily: 'Roboto';
    cleanupSettings: CleanupSettings;
}