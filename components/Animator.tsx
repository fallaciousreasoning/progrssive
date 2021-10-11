import { useNavigationType } from "hooks/url";
import useValueRef from 'hooks/useValueRef';
import React, { useEffect, useState } from "react";

type Child = React.ReactElement<{ className?: string, key: string }>;
interface ChildStates {
    [key: string]: {
        state: 'intial' | 'entering' | 'exiting';
        className: string;
        timeout?: NodeJS.Timeout;
        element: Child;
    }
}

interface AnimatorProps {
    children: Child | Child[];
    animateInitial?: boolean;
    presentClass?: string;
    hiddenClass?: string;
    baseClass?: string;
    duration: 75 | 100 | 200 | 300 | 500 | 700 | 1000
}

const positions = {
    right: 'translate-x-full',
    middle: 'translate-x-0',
    left: '-translate-x-full'
};

const getPosition = (mode: 'entering' | 'exiting', navigation: 'forward' | 'back') => {
    if (mode == 'entering')
        return navigation == 'forward' ? positions.right : positions.left;
    if (mode == 'exiting')
        return navigation === 'forward' ? positions.left : positions.right;
}

const durations = {
    75: 'duration-75',
    100: 'duration-100',
    200: 'duration-200',
    300: 'duration-300',
    500: 'duration-500',
    700: 'duration-700',
    1000: 'duration-1000',
}

export default function Animator(props: AnimatorProps) {
    const duration = props.duration;
    const children = Array.isArray(props.children) ? props.children : [props.children];
    const [previous, setPrevious] = useState<ChildStates>({});
    const directionRef = useValueRef(useNavigationType());
    
    useEffect(() => {
        const newChildren = children.filter(c => !(c.key in previous) || previous[c.key].state === "exiting");
        const removedChildren = Object.keys(previous).filter(c => !previous[c].timeout && !children.some(cur => cur.key === c));

        // Properly remove the items when the animation finishes.
        let timeout: NodeJS.Timeout;
        if (removedChildren.length) {
            timeout = setTimeout(() => {
                setPrevious(current => {
                    const result = { ...current };
                    for (const key of removedChildren) {
                        if (current[key].timeout !== timeout) continue;
                        delete result[key];
                    }
                    return result;
                });
            }, duration);
        }

        if (newChildren.length) {
            setTimeout(() => {
                setPrevious(current => ({
                    ...current,
                    ...newChildren.reduce((prev, next) => ({
                        ...prev,
                        [next.key]: { ...current[next.key], className: positions.middle, state: 'entering' }
                    }), {})
                }));
            }, 10);
        }

        if (removedChildren.length || newChildren.length) {
            setPrevious(current => ({
                ...current,
                // Set removed children to exiting, with their timeout value.
                ...removedChildren.reduce((prev, next) => ({
                    ...prev,
                    [next]: { ...current[next], className: getPosition('exiting', directionRef.current), state: 'exiting', timeout }
                }), {}),
                // Add new children.
                ...newChildren.reduce((prev, next) => ({
                    ...prev,
                    [next.key]: { state: 'initial', className: getPosition('entering', directionRef.current), element: next }
                }), {})
            }));
        }
    }, [children])

    return <div className="relative">
        {Object.values(previous).map(child => <div
            key={child.element.key}
            className={`absolute top-0 bottom-0 left-0 right-0 transform ease-in transition-transform ${durations[duration]} ${child.className}`}>
            {child.element}
        </div>)}
    </div>
}