import * as React from 'react';
import { useRef, useState } from 'react';
import { debounce } from '../services/debounce';
import { RootRef } from '@material-ui/core';

interface Props {
    getContainer: (node: HTMLElement) => HTMLElement;
    children: (visible: boolean) => React.ReactNode;
}

const isAbove = (container: HTMLElement, element: HTMLElement) => {
    if (!container || !element) return false;

    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return elementRect.bottom < containerRect.top;
}
export const ScrollVisibility = (props: Props) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [scrollContainer, setScrollContainer] = useState(null);
    const [scrollHandler, setScrollHandler] = useState(null);
    const [above, setAbove] = useState(false);

    React.useEffect(() => {
        if (!elementRef || !elementRef.current) return;

        // TODO: This doesn't seem to be removing the handler?
        if (scrollContainer && scrollHandler)
            scrollContainer.removeEventListener('scroll', scrollHandler);
        
        const handler = e => {
            const newAbove = isAbove(scrollContainer, elementRef.current);

            // Debouncing isn't working, don't trigger rerender.
            if (newAbove !== above) setAbove(newAbove);
        };

        const debounced = debounce(handler, 1000);

        const container = props.getContainer(elementRef.current);
        setScrollContainer(container);
        setScrollHandler(debounced);
        container.addEventListener('scroll', debounced, { passive: true })
        
        return () => {
            scrollContainer && scrollHandler && scrollContainer.removeEventListener('scroll', scrollHandler);
        }
    }, [props.getContainer, elementRef]);



    return <RootRef rootRef={elementRef}>
        {props.children(!above)}
    </RootRef>;
}