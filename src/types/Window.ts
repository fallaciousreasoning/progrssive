import { WithSnackbarProps } from "notistack";

declare global {
    interface Window {
        snackHelper: WithSnackbarProps;
    }
}