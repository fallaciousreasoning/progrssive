import { useEffect, useState } from "react";

interface Props<T> {
    fallback?: JSX.Element;
    children: (result: T) => JSX.Element;
}

export function lazyLoader<T>(promise: Promise<T>) {
    return (props: Props<T>) => {
        const [content, setContent] = useState(undefined);
        useEffect(() => {
            promise.then(setContent);
        });

        return content === undefined
            ? props.fallback || null
            : props.children(content);
    }
}