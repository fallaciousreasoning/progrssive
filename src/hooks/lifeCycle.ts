import { useEffect, useState } from "react";

type Return = void | (() => any | void);

export const useOnMount = (onMount: () => Return) => {
    const [mounted, setMounted] = useState(false);
    const [onUnmount, setOnUnmount] = useState(undefined);

    useEffect(() => {
        if (mounted) return onUnmount;

        const result = onMount();
        setMounted(true);
        setOnUnmount(result);
        return result;
    });
}