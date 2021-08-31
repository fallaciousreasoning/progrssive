import React, { useEffect, useMemo, useState } from "react"

type Child = React.ReactElement<{ className?: string, key: string }>;
interface ChildStates {
    [key: string]: {
        state: 'intial' | 'entering' | 'exiting';
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

const states = {
    initial: 'translate-x-full',
    entering: 'translate-x-0',
    exiting: '-translate-x-full'
};

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
    const children = Array.isArray(props.children) ? props.children : [props.children];
    const [previous, setPrevious] = useState<ChildStates>({});
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
            }, props.duration);
        }

        if (newChildren.length) {
            setTimeout(() => {
                setPrevious(current => ({
                    ...current,
                    ...newChildren.reduce((prev, next) => ({ 
                        ...prev,
                        [next.key]: { ...current[next.key], state: 'entering' }
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
                    [next]: { ...current[next], state: 'exiting', timeout }
                }), {}),
                // Add new children.
                ...newChildren.reduce((prev, next) => ({
                    ...prev,
                    [next.key]: { state: 'initial', element: next }
                }), {})
            }));
        }
    }, [children])

    return <div>
        {Object.values(previous).map(child => <div key={child.element.key} className={`transform transition-transform ${durations[props.duration]} ${states[child.state]}`}>
            {child.element}
        </div>)}
    </div>
}