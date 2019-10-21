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

export const useDoubleTap = (callback: (...args) => void, change: [], delay = 200) => useNTap(callback, change, 2, delay);

interface ScrollEvents {
    onStart?: (t: HTMLElement) => void;
    onEnd?: (t: HTMLElement) => void;
    onScroll?: (t: HTMLElement) => void;
}

export const useOnScroll = (handlers: ScrollEvents) => {
    const [isScrolling, setScrolling ] = useState(false);
    const [scrollTimeout, setScrollTimeout] = useState(undefined);

    const memoized = useCallback((e) => {
        const target = e.target;

        // Reset timeout.
        clearTimeout(scrollTimeout);

        if (!isScrolling) {
            setScrolling(true);
            handlers.onStart && handlers.onStart(target);
        }

        handlers.onScroll && handlers.onScroll(target);

        const newScrollTimeout = setTimeout(() => {
            setScrolling(false);
            handlers.onEnd && handlers.onEnd(target);
        }, 100);
        setScrollTimeout(newScrollTimeout);
    }, [handlers, isScrolling, scrollTimeout]);

    return memoized;
};

export const useOnScrollEnd = (handler: (target: HTMLElement) => void) => {
    return useOnScroll({ onEnd: handler });
};