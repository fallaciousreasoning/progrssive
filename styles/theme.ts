import { createMuiTheme } from "@material-ui/core";
import * as colors from '@material-ui/core/colors';
import { grey } from "@material-ui/core/colors";
import { defaultSettings } from "../actions/settings";
import { getStore } from "../hooks/store";
import { Settings } from "../types/RecollectStore";

export const accentColors = [
    "amber",
    "cyan",
    "blue",
    "green",
    "orange",
    "purple",
    "red",
    "deepPurple",
    "pink",
    "teal",
    "yellow",
    "lightGreen",
    "lightBlue",
] as const;
export type AccentColor = typeof accentColors[number];

export const getColor = (colorName: AccentColor) => {
    const color = colors[colorName] || colors.green;
    const weight = themeMode() === "dark"
        ? 700
        : 500;

    return color[weight];
}

export const themeMode = () => {
    const preferDark = typeof window !== "undefined" && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const setting = getStore().settings?.theme ?? 'device';

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

export const supportedFonts = Object.keys(fonts);

const themeMeta = () =>
    typeof document === "undefined"
    ? null
    : document.querySelector('meta[name="theme-color"]');
export const buildTheme = (settings: Settings) => {
    settings = settings ?? defaultSettings;
    const type = themeMode();
    const fontFamily = fonts[settings.fontFamily] || fonts.Roboto;
    const accentColor = getColor(settings?.accent || 'green');
    
    // Update the theme color used by the browser.
    themeMeta()?.setAttribute('content', accentColor);

    const theme = createMuiTheme({
        palette: {
            type: type,
            primary: {
                main: accentColor
            },
            secondary: {
                main: getColor(settings.secondaryAccent || 'pink')
            },
            background: {
                default: type === "dark"
                    ? grey[900]
                    : grey[50]
            },
            text: {
                primary: type === "dark"
                    ? grey[200]
                    : grey[900]
            }
        },
        typography: {
            fontSize: 8 + (settings.fontSize * 2),
            fontFamily: fontFamily,
            allVariants: {
                color: type === "dark"
                    ? grey[200]
                    : grey[900]
            }
        }
    });
    return theme;
}