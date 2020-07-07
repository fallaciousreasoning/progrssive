import { createMuiTheme } from "@material-ui/core";
import { Settings } from "./types/RecollectStore";

export const buildTheme = (settings: Settings, preferDark: boolean) => {
    const type = settings.theme === "device"
        ? (preferDark ? 'dark' : 'light')
        : settings.theme;
    const theme = createMuiTheme({
        palette: {
            type: type,
            primary: {
                main: '#2BB24C'
            },
            background: {
                default: type === "dark"
                    ? "#212121" // grey900
                    : "#fafafa" // grey50
            }
        },
        typography: {
            fontSize: 8 + (settings.fontSize * 2)
        }
    });
    console.log(theme.palette);
    return theme;
}