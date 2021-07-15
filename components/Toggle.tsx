import React, { useCallback } from "react";

interface Props {
    label?: string | React.ReactNode;
    name?: string;
    value: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, value: boolean) => void;
}

export default function Toggle(props: Props) {
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e, e.target.checked);
    }, [props.onChange]);

    const toggleContent = <div className="relative">
        <input name={props.name} type="checkbox" className="sr-only" checked={props.value} onChange={onChange}/>
        <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner" />
        <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition" />
    </div>;

    const label = typeof props.label === "string"
        ? <span>{props.label}</span>
        : props.label;
    return <div className="toggle">
        <label className="flex items-center cursor-pointer space-x-2">
            {label}
            {toggleContent}
        </label>
    </div>
}