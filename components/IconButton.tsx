import React from "react";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    disabled?: boolean;
    children: React.ReactElement;
}

export default function IconButton(props: Props) {
    const { children, className, disabled, onClick, ...rest } = props;
    const classToApply = className ?? 'p-3'

    return <button onClick={disabled ? null : onClick}
        className={`rounded-full relative ${disabled ? 'opacity-20' : ''} ${classToApply}`}
        {...rest}>
        <div className="absolute transition-colors rounded-full top-1 bottom-1 left-1 right-1 bg-input hover:opacity-20 opacity-0"/>
        {React.cloneElement<any>(props.children, { width: 24, height: 24 })}
    </button>
}