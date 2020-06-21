import { withSnackbar } from "notistack";
import "../types/Window";

export const SnackbarHelper = withSnackbar((props) => {
    window.snackHelper = props;
    return null;
});