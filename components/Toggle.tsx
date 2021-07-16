import { useTheme } from "@/hooks/responsive";
import React, { useCallback } from "react";

interface Props {
    id?: string;
    label?: string;
    name?: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, value: boolean) => void;
}

export default function Toggle(props: Props) {
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e, e.target.checked);
    }, [props.onChange]);

    const isDark = useTheme() == 'dark';

    const toggleContent = <div className="relative">
        <input id={props.id} name={props.name} type="checkbox" className="sr-only" checked={props.checked} onChange={onChange}/>
        <div className={`w-10 h-4 ${isDark ? 'bg-gray-600' : 'bg-gray-400'} rounded-full shadow-inner`} />
        <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition" />
    </div>;

    return <div className="toggle">
        <label className="flex items-center cursor-pointer space-x-2">
            {props.label && <span>{props.label}</span>}
            {toggleContent}
        </label>
    </div>
}