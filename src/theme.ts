import { createMuiTheme } from "@material-ui/core";
import {
    amber,
    cyan,
    blue,
    green,
    grey,
    orange,
    purple,
    red,
    deepPurple,
    pink,
    teal,
    yellow,
    lightGreen,
    lightBlue
} from "@material-ui/core/colors";
import { Settings } from "./types/RecollectStore";

export const accentColors = [
    amber,
    cyan,
    blue,
    green,
    orange,
    purple,
    red,
    deepPurple,
    pink,
    teal,
    yellow,
    lightGreen,
    lightBlue
].map(c => c[500]);

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

export const buildTheme = (settings: Settings, preferDark: boolean) => {
    const type = settings.theme === "device"
        ? (preferDark ? 'dark' : 'light')
        : settings.theme;

    const fontFamily = fonts[settings.fontFamily] || fonts.Roboto;

    const theme = createMuiTheme({
        palette: {
            type: type,
            primary: {
                main: settings.accent || green[500]
            },
            secondary: {
                main: settings.secondaryAccent || purple[500]
            },
            background: {
                default: type === "dark"
                    ? grey[900]
                    : grey[50]
            }
        },
        typography: {
            fontSize: 8 + (settings.fontSize * 2),
            fontFamily: fontFamily
        }
    });
    return theme;
}