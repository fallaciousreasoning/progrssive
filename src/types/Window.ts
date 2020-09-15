import { WithSnackbarProps } from "notistack";

declare global {
    type RequestIdleCallbackHandle = any;
    type RequestIdleCallbackOptions = {
        timeout: number;
    };
    type RequestIdleCallbackDeadline = {
        readonly didTimeout: boolean;
        timeRemaining: (() => number);
    };

    interface Window {
        snackHelper: WithSnackbarProps;
        requestIdleCallback: ((
            callback: ((deadline: RequestIdleCallbackDeadline) => void),
            opts?: RequestIdleCallbackOptions,
        ) => RequestIdleCallbackHandle);
        cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);

    }
}