import React, { useState, useRef, useCallback } from 'react'
import Menu from 'components/Menu';

interface Props {
    trigger: React.ReactElement;
    children: React.ReactElement | React.ReactElement[];
}

export default function ToggleMenu(props: Props) {
    const triggerRef = useRef();

    const [isOpen, setOpen] = useState(false);
    const trigger = React.cloneElement(props.trigger, {
        ...props.trigger.props,
        onClick: () => setOpen(true),
        ref: triggerRef,
        className: `${props.trigger.props.className} duration-500 ${isOpen && 'bg-background'}`
    });

    const children = (Array.isArray(props.children)
        ? props.children
        : [props.children]).filter(c => c)

    return <>
        {trigger}
        <Menu isOpen={isOpen} setOpen={setOpen}>
            {children}
        </Menu>
    </>
}