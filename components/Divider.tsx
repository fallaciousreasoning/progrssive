import React from "react";

export default function Divider(props: React.HTMLProps<HTMLHRElement>) {
    const { className, ...rest } = props;
    return <hr className={`border-input ${className}`} {...rest}/>
}