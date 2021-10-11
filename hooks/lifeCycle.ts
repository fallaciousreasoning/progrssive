import { useEffect, useState } from "react";

type Return = void | (() => any | void);

export const useOnMount = (onMount: () => Return) => {
    const [invoked, setInvoked] = useState(false);

    useEffect(() => {
        if (invoked)
            return;

        onMount();
        setInvoked(true);
    }, [onMount, invoked]);
}