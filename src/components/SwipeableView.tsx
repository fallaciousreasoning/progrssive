import * as React from 'react'
import { useEffect, useCallback } from 'react';

interface Props {
    children: React.ReactNode[] | React.ReactNode;
}

export const SwipeableView = (props: Props) => {
    const children = Array.isArray(props.children) ? props.children : [props.children];

    const onScroll = useCallback((e) => {

    }, []);

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