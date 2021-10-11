import { useEffect, useState } from "react";

export const useResult = <T>(promise: (Promise<T> | (() => Promise<T>)), dependencies: any[] = [], defaultValue: T = undefined) => {
    const [result, setResult] = useState(defaultValue);
    const p = typeof promise === "function"
        ? promise
        : () => promise;

    useEffect(() => {
        let unmounted = false;    
        p().then(result => {
            if (unmounted)
                return;

            setResult(result);
        });

        return () => unmounted = true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...dependencies]);

    return result;
}
