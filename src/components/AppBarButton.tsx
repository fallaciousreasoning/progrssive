import React, { useContext, useEffect, useState } from 'react';
import { AppBarContext } from "./AppBar";

export default (props: { children: React.ReactNode, name?: string; }) => {
    const context = useContext(AppBarContext);
    const [id] = useState(Math.random().toString());
    useEffect(() => {
        context.add({
            id,
            child: props.children
        });

        return () => {
            context.remove(id);
        }
    });

    return null;
}