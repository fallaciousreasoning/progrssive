import * as React from 'react'
import { useEffect, useCallback, useRef, useState } from 'react';
import { useOnScrollEnd } from '../hooks/callbacks';

interface Props {
    children: React.ReactNode[] | React.ReactNode;

    onSwiped?: (selectedIndex: number) => void;
    activeIndex?: number;
}

export const SwipeableView = (props: Props) => {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    
    const swipeableView = useRef(null);
    const [activeIndex, setActiveIndex] = useState(props.activeIndex || 0);
    
    // Update active index based on props.activeIndex.
    useEffect(() => {
        if (isNaN(props.activeIndex) || activeIndex === props.activeIndex)
          return;

        if (!swipeableView.current)
          return;

        if (props.activeIndex < 0 || swipeableView.current && props.activeIndex > swipeableView.current.children.length)
          throw new Error(`Index ${props.activeIndex} out of range!`);

        const child = swipeableView.current.children[props.activeIndex];
        swipeableView.current.scrollTo(child.offsetLeft, 0);

        setActiveIndex(props.activeIndex);
    }, [props.activeIndex])

    const onScroll = useOnScrollEnd(element => {
        let selectedChild;
        for (selectedChild = 0; selectedChild < element.children.length; ++selectedChild) {
            const child: any = element.children[selectedChild];
            if (child.offsetLeft - element.scrollLeft >= -10) {
                break;
            }
        }

        if (selectedChild !== activeIndex) {
            setActiveIndex(selectedChild);
            props.onSwiped && props.onSwiped(selectedChild);
        }
    });

    return <div style={{
        scrollSnapType: 'x mandatory',
        overflowX: 'scroll',
        display: 'flex',
        scrollbarWidth: 'none',
    }}
        onScroll={onScroll}
        ref={swipeableView}>
        {children.map((c, i) => <div key={i} style={{
            flexShrink: 0,
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always'
        } as any}>
            {c}
        </div>)}
    </div>
}