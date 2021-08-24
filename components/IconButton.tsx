import React from "react";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    children: React.ReactElement;
}

export default function IconButton(props: Props) {
    const {children, className, ...rest} = props;

    return <button className={`rounded-full p-3 opacity-50 hover:bg-gray-500 ${className}`} {...rest}>
        {React.cloneElement<any>(props.children, { width: 24, height: 24 })}
    </button>
}