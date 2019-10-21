import * as React from 'react'
import { useEffect, useCallback } from 'react';
import { useOnScrollEnd } from '../hooks/callbacks';

interface Props {
    children: React.ReactNode[] | React.ReactNode;
    onSwiped: (selectedIndex: number) => void;
}

export const SwipeableView = (props: Props) => {
    const children = Array.isArray(props.children) ? props.children : [props.children];

    const onScroll = useOnScrollEnd(element => {
        let selectedChild;
        for (selectedChild = 0; selectedChild < element.children.length; ++selectedChild) {
            const child: any = element.children[selectedChild];
            if (child.offsetLeft - element.scrollLeft >= 0) {
                break;
            }
        }

        props.onSwiped && props.onSwiped(selectedChild);
    });

    return <div style={{
        scrollSnapType: 'x mandatory',
        overflowX: 'scroll',
        display: 'flex',
        scrollbarWidth: 'none',
    }}
        onScroll={onScroll}>
        {children.map((c, i) => <div key={i} style={{
            flexShrink: 0,
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always'
        } as any}>
            {c}
        </div>)}
    </div>
}