import { useState, useMemo, useEffect } from "react";

export const useScreenSize = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const listener = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        window.addEventListener('resize', listener);
        return () => {
            window.removeEventListener('resize', listener);
        };
    });

    const size = useMemo(() => ({ width, height }), [width, height]);
    return size;
}