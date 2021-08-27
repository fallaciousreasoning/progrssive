import { defaultSettings } from "services/settings";
import { Settings } from 'model/settings';
import { getColorForTheme, grey } from 'styles/colors';

export const themeMode = (settings: Settings) => {
    const preferDark = typeof window !== "undefined" && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const setting = settings?.theme ?? 'device';

    return setting === "device"
        ? (preferDark ? 'dark' : 'light')
        : setting;
}

export const fonts = {
    "Roboto": `"Roboto", "Helvetica", "Arial", sans-serif`,
    "Helvetica": `"Helvetica", "Arial", sans-serif`,
    "Verdana": `Verdana, Geneva, sans-serif`,
    "Tahoma": `Tahoma, Geneva, sans-serif`,
    "Arial": `Arial, Helvetica, sans-serif`,
    "Arial Black": `"Arial Black", Gadget, sans-serif`,
    "Trebuchet MS": `"Trebuchet MS", Helvetica, sans-serif`,
    "Impact": `Impact, Charcoal, sans-serif`,
    "Lucida Sans Unicode": `"Lucida Sans Unicode", "Lucida Grande", sans-serif`,

    "Bookman Old Style": `"Bookman Old Style", serif`,
    "Times New Roman": `"Times New Roman", Times, serif`,
    "Georgia": `"Georgia", serif`,
    "Garamond": `"Garamond", serif`,
    "Comic Sans MS": `"Comic Sans MS", cursive, sans-serif`,

    "Courier New": `"Courier New", Courier, monospace`,
    "Lucida Console": `"Lucida Console", Monaco, monospace`
};

export const supportedFonts: (keyof typeof fonts)[] = Object.keys(fonts) as any;

const themeMeta = () =>
    typeof document === "undefined"
        ? null
        : document.querySelector('meta[name="theme-color"]');