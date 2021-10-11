import { useEffect } from "react";
import { useIsFrontend } from "./useIsFrontend"
import 'types/Window';

const idlePolyFill = globalThis.requestIdleCallback || ((callback: () => void) => setTimeout(callback, 5000));
export const useOnIdle = (func: () => void | Promise<void>) => {
    const frontEnd = useIsFrontend();
    useEffect(() => {
        if (!frontEnd) return;

        idlePolyFill(func);
    }, [frontEnd]);
}