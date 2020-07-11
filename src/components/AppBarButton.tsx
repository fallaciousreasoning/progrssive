import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AppBarContext } from "./AppBar";

const now = () => {
    if ('performance' in window)
        window.performance.now();
    return Date.now();
}

export default (props: { children: React.ReactNode, name?: string; }) => {
    const context = useContext(AppBarContext);
    const [id] = useState(props.children['key'] || props.children['id'] || Math.random().toString());
    const sort = useMemo(() => now(), [id]);

    useEffect(() => {
        context.add({
            id,
            sort,
            child: props.children
        });

        return () => {
            context.remove(id);
        }
    }, [props.children]);

    return null;
}