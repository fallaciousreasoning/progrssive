import { useState, useEffect, useCallback } from "react";

let installPrompt: () => void;
export default () => {
    const [canPrompt, setHasPrompt] = useState(!!installPrompt);

    const prompt = useCallback(() => {
        if (installPrompt)
            installPrompt();

        installPrompt = undefined;
        setHasPrompt(false);
    }, []);

    useEffect(() => {
        const listener = e => {
            installPrompt = e.prompt;
            setHasPrompt(!!e.prompt);
        };
        window.addEventListener('beforeinstallprompt', listener);
        return () => {
            window.removeEventListener('beforeinstallprompt', listener);
        }
    }, []);

    return canPrompt ? prompt : null;
}