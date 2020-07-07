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

export const buildTheme = (settings: Settings, preferDark: boolean) => {
    const type = settings.theme === "device"
        ? (preferDark ? 'dark' : 'light')
        : settings.theme;
    const theme = createMuiTheme({
        palette: {
            type: type,
            primary: {
                main: settings.accent || '#2BB24C'
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
    console.log(theme.palette);
    return theme;
}