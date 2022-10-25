import { useIsFrontend } from "@/hooks/useIsFrontend";
import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import StackPanel from "./StackPanel";

export interface ToastMessage {
    id?: string | number;
    message: string | React.ReactNode;
    action?: string | React.ReactNode | ((props: ToastProps) => React.ReactNode);
    duration?: number;
}

export interface ToastProps extends ToastMessage {
    dismiss: () => void;
}

function Toast(props: ToastProps) {
    return <div className="bg-foreground text-background p-2 rounded w-64 flex items-center">
        {props.message}
        <div className="flex-1" />
        {typeof props.action === "function" ? props.action(props) : props.action}
    </div>;
}
export default function Toasts() {
    const MAX_TOASTS = 5;
    const DEFAULT_DURATION = 3000;
    const [toasts, setToasts] = useState<ToastProps[]>([]);
    const toastCreator = useCallback((toast: ToastMessage | string) => {
        toast = typeof toast === "string" ? { message: toast } : toast;
        const toDisplay: ToastProps = { id: Math.random(), duration: DEFAULT_DURATION, dismiss: null, ...toast };
        setToasts(toasts => [...toasts.filter(t => t.id !== toDisplay.id).slice(1 - MAX_TOASTS, toasts.length), toDisplay]);
        const dismiss = () => setToasts(toasts => {
            const copy = [...toasts];
            const index = copy.indexOf(toDisplay);
            if (index !== -1) copy.splice(index, 1);
            return copy;
        });
        toDisplay.dismiss = dismiss;
        setTimeout(dismiss, toDisplay.duration);
    }, []);

    const isFrontEnd = useIsFrontend();
    if (!isFrontEnd) return null;
    window.showToast = toastCreator;

    return ReactDOM.createPortal(<>
        <div className="fixed bottom-2 left-2">
            <StackPanel>
                {toasts.map(t => <Toast key={t.id} {...t} />)}
            </StackPanel>
        </div>
    </>, document.body)
}
