import { createMuiTheme } from "@material-ui/core";
import { Settings } from "./types/RecollectStore";

export const buildTheme = (settings: Settings) => createMuiTheme({
    palette: {
        primary: {
            main: '#2BB24C'
        },
    },
    typography: {
        fontSize: 8 + (settings.fontSize * 2)
    }
});