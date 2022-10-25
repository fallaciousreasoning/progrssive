import { useEffect, useState } from "react"

export const useDebounced = <T>(value: T, delay: number) => {
    const [cached, setCached] = useState(value);
    useEffect(() => {
        const timeout = setTimeout(() => setCached(value), delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);
    return cached;
}
