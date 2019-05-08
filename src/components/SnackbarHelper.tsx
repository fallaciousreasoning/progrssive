import { withSnackbar } from "notistack";
import * as React from 'react';
import "../types/Window";

export const SnackbarHelper = withSnackbar((props) => {
    window.snackHelper = props;
    return null;
});