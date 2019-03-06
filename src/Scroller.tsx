import React, { useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useOnMount } from "./hooks/lifeCycle";

type ScrollPos = { x: number, y: number };
type ScrollData = { [key: string]: { x: number, y: number } };
const scrollData = (JSON.parse(sessionStorage.getItem('ScrollManager')) || {}) as ScrollData;
const retryRate = 100;

window.addEventListener('beforeunload', () => sessionStorage.setItem('ScrollManager', JSON.stringify(scrollData)));

const tryScroll = (to: Partial<ScrollPos>, delay?: number, allowedDelay = 1000) => {
    to.x = to.x || 0;
    to.y = to.y || 0;

    setTimeout(() => {
        window.scrollTo(to.x, to.y);

        if (allowedDelay <= 0) return;
        if (window.scrollX === to.x && window.scrollY === to.y) return;

        tryScroll(to, retryRate, allowedDelay - retryRate);
    }, delay);
}

const tryRestore = (fragment: string) => {
    const to = scrollData[fragment];
    tryScroll(to || {});
}

export const ScrollToTopOnMount = (props) => {
    return <ScrollToOnMount x={0} y={0} />;
}

export const ScrollToOnMount = (props: { x?: number, y?: number, delay?: number }) => {
    useOnMount(() => {
        setTimeout(() => tryScroll(props), props.delay || 0);
    });

    return <React.Fragment />;
}

type RestoreScrollProps = RouteComponentProps<any> & {
    defaultScrollPos?: ScrollPos;
};

export const RestoreScroll = withRouter((props: RestoreScrollProps) => {
    // Enable/Disable scroll restoration.
    useEffect(() => {
        if (!('scrollRestoration' in history)) {
            return;
        }

        const previous = history.scrollRestoration;
        history.scrollRestoration = 'manual';

        return () => {
            history.scrollRestoration = previous;
        }
    });

    useOnMount(() => {
        let lastFragment = props.location.pathname;
        tryRestore(lastFragment);

        const unregister = props.history.listen(event => {
            scrollData[lastFragment] = { x: window.scrollX, y: window.scrollY };
            console.log(`Stored`, scrollData[lastFragment], `for ${lastFragment}`);

            lastFragment = event.pathname;
            tryRestore(lastFragment);
        });

        return // TODO fix useOnMount () => unregister();
    });

    return <React.Fragment />;
})

