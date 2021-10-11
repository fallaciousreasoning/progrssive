import React, { useState } from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function TextField(props: TextFieldProps) {
    const { className, label, ...inputProps } = props;
    const [hasFocus, setFocus] = useState(false);
    return <div className={`${className} bg-input opacity-90 hover:opacity-100 rounded-t-md border-b transition-colors ${hasFocus ? 'border-primary' : 'border-black'}`}>
        <div className="p-2 flex flex-col">
        <label className={`text-xs transition-colors ${hasFocus && 'text-primary'}`}>{props.label}</label>
        <input className="bg-transparent text-base focus:outline-none" onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} {...inputProps}/>
        </div>
        <div className={`h-0.5 w-full bg-primary transition-transform transform ${hasFocus ? 'scale-x-100' : 'scale-x-0'}`}/>
    </div>
}