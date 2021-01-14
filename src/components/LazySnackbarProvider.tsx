import { useResult } from "../hooks/promise"
import React, { Suspense } from 'react';

window.snackHelper = {
    enqueueSnackbar: (() => { }),
    closeSnackbar: (() => { })
} as any;

const SnackbarProvider = React.lazy(() => import('notistack').then(n => ({ default: n.SnackbarProvider }))) as any;
const SnackHelper = (props: { useSnackbar: () => any }) => {
    const snackbar = props.useSnackbar ? props.useSnackbar() : () => {};
    window.snackHelper = snackbar;
    return null;
}

export default (props) => {
    const { useSnackbar } = useResult(() => import('notistack'), [], {} as any);

    return <Suspense fallback={props.children}>
        <SnackbarProvider>
            <SnackHelper useSnackbar={useSnackbar} />
            {props.children}
        </SnackbarProvider>
    </Suspense>
}