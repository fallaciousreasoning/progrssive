import { useEffect, useState } from "react";

export const useResult = <T>(promise: Promise<T>) => {
    const [result, setResult] = useState(undefined);

    useEffect(() => {
        if (result) return;
        
        promise.then(setResult);
    });

    return result;
}

export const executeOnce = <T>(execute: (...args) => Promise<T>, ...keys) => {
    useEffect(() => {
        execute(...keys);
    }, [...keys]);
}