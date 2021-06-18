import { useResult } from "../hooks/promise"
import React, { Suspense } from 'react';
import { useIsFrontend } from '../hooks/useIsFrontend';

if (typeof window !== "undefined") {
    window.snackHelper = {
        enqueueSnackbar: (() => { }),
        closeSnackbar: (() => { })
    } as any;
}

const SnackbarProvider = React.lazy(() => import('notistack').then(n => ({ default: n.SnackbarProvider }))) as any;
const SnackHelper = (props: { useSnackbar: () => any }) => {
    if (!window) return null;

    if (props.useSnackbar)
        window.snackHelper = props.useSnackbar();
    else window.snackHelper = (() => { }) as any;
    return null;
}

export default (props) => {
    const { useSnackbar } = useResult(() => import('notistack'), [], {} as any);
    const isFrontEnd = useIsFrontend();
    if (!isFrontEnd) return null;
    return <Suspense fallback={props.children}>
        <SnackbarProvider>
            <SnackHelper useSnackbar={useSnackbar} />
            {props.children}
        </SnackbarProvider>
    </Suspense>
}