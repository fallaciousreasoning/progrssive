import React, { useState, useRef, useCallback } from 'react'
import Menu from 'components/Menu';

interface Props {
    trigger: React.ReactElement;
    children: React.ReactElement | React.ReactElement[];
}

export default function ToggleMenu(props: Props) {
    const [isOpen, setOpen] = useState(false);
    const trigger = React.cloneElement(props.trigger, {
        ...props.trigger.props,
        onClick: () => setOpen(true),
        className: `${props.trigger.props.className ?? 'p-3'} duration-300 transition-colors ${isOpen && 'bg-input'}`
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