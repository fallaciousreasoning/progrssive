import { useEffect, useState } from "react";
import { resolvable } from "../utils/promise";

let installPrompt: () => void;
export default () => {
    const [canPrompt, setHasPrompt] = useState(!!installPrompt);

    useEffect(() => {
        const listener = async e => {
            e.preventDefault();
            installPrompt = e.prompt;
            setHasPrompt(!!e.prompt);

            const { resolve, promise } = resolvable();
            installPrompt = resolve;

            await promise;

            await e.prompt().catch(() => { });

            installPrompt = undefined;
            setHasPrompt(false);
        };
        window.addEventListener('beforeinstallprompt', listener);
        return () => {
            window.removeEventListener('beforeinstallprompt', listener);
        }
    }, []);

    return canPrompt ? installPrompt : null;
}