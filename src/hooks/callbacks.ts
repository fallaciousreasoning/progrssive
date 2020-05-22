import * as React from 'react';
import { useCallback, useState } from 'react';

export const useNTap = <Type>(callback: (...args) => void, change: [], requiredTaps = 2, delay = 200) => {
    // Should be fine here. If we rerender a double tap should be cancelled anyway.
    let taps = 0;
    const memoized = useCallback((...args) => {
        // Increment number of taps
        taps++;
        // After timeout, we don't care about this tap.
        setTimeout(() => taps--, delay);

        // If we've tapped enough times, fire the callback.
        if (taps >= requiredTaps) callback(...args);
    }, [...change, requiredTaps, delay]);

    return memoized;
}

export const useDoubleTap = (callback: (...args) => void, change: [], delay = 500) => useNTap(callback, change, 2, delay);

interface ScrollEvents {
    onStart?: () => void;
    onEnd?: () => void;
    onScroll?: () => void;
}

export const useOnScroll = (handlers: ScrollEvents) => {
    const [isScrolling, setScrolling ] = useState(false);
    const [scrollTimeout, setScrollTimeout] = useState(undefined);

    const memoized = useCallback((e) => {
        // Reset timeout.
        clearTimeout(scrollTimeout);

        if (!isScrolling) {
            setScrolling(true);
            handlers.onStart && handlers.onStart();
        }

        handlers.onScroll && handlers.onScroll();

        const newScrollTimeout = setTimeout(() => {
            setScrolling(false);
            handlers.onEnd && handlers.onEnd();
        }, 100);
        setScrollTimeout(newScrollTimeout);
    }, [handlers, isScrolling, scrollTimeout]);

    return memoized;
};

export const useOnScrollEnd = (handler: () => void) => {
    return useOnScroll({ onEnd: handler });
};