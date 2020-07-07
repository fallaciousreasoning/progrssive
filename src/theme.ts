import { createMuiTheme } from "@material-ui/core";
import { Settings } from "./types/RecollectStore";
import { grey } from "@material-ui/core/colors";

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