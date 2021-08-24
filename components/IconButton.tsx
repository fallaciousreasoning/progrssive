import React from "react";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    disabled?: boolean;
    children: React.ReactElement;
}

export default function IconButton(props: Props) {
    const { children, className, disabled, onClick, ...rest } = props;

    return <button onClick={disabled ? null : onClick}
        className={`rounded-full p-3 ${disabled ? 'opacity-20' : 'opacity-50 hover:bg-gray-500'} ${className}`}
        {...rest}>
        {React.cloneElement<any>(props.children, { width: 24, height: 24 })}
    </button>
}