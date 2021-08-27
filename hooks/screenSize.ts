import { useState, useMemo, useEffect } from "react";
import { useIsFrontend } from "./useIsFrontend";

export const useScreenSize = () => {
    const isFrontEnd = useIsFrontend();
    const [width, setWidth] = useState(globalThis.innerWidth);
    const [height, setHeight] = useState(globalThis.innerHeight);

    useEffect(() => {
        const listener = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        listener();
        window.addEventListener('resize', listener);
        return () => {
            window.removeEventListener('resize', listener);
        };
    }, [isFrontEnd]);

    const size = useMemo(() => ({ width, height }), [width, height]);
    return size;
}