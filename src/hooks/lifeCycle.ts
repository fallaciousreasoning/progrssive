import { useEffect } from "react";

type Return = void | (() => any | void);

export const useOnMount = (onMount: () => Return) => {
    useEffect(() => {
        return onMount();
    }, []);
}