import { ToastMessage } from 'components/Toasts';
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
        showToast: (props: ToastMessage | string) => void;
    }
}
