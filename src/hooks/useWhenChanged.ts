import { useState } from "react"

export default <T>(func: () => T, watch: any[], onInitial = true) => {
    const [prev, setPrev] = useState<any[]>(undefined);

    // If this is the first time the function has run, invoke func
    if (!prev && onInitial) {
        setPrev(watch)
        func();
        return;
    }

    // The length of the arrays should always match.
    if (watch.length !== prev.length) {
        throw new Error(`Length of watch array changed!`);
    }

    // Determine whether any item in the array has changed.
    let changed = false;
    for (let i = 0; i < watch.length; ++i) {
        if (watch[i] !== prev[i]) {
            changed = true;
            break;
        }
    }

    // If something changed, invoke func.
    if (changed) {
        setPrev(watch);
        func();
    }
}