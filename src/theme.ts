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

export const supportedFonts = [
    "Roboto",
    "Times New Roman",
    "Georgia", 
    "Garamond", 
    "Bookman Old Style",
    "Verdana",
    "Arial",
    "Trebuchet MS",
    "Comic Sans MS"
]

export const buildTheme = (settings: Settings, preferDark: boolean) => {
    const type = settings.theme === "device"
        ? (preferDark ? 'dark' : 'light')
        : settings.theme;
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
            fontSize: 8 + (settings.fontSize * 2)
        }
    });
    return theme;
}