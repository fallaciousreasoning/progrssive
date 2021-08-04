import { useTheme } from "@/hooks/responsive";
import React, { useCallback, useMemo, useState } from "react"

type DivProps = Omit<React.HTMLProps<HTMLDivElement>, 'value' | 'onChange'>;
export interface SelectProps<T> extends DivProps {
    value?: T;
    onChange?: (value: T) => void;

    items: T[];
    renderValue: (item: T) => React.ReactNode;
    renderItem: (item: T, selected: boolean) => React.ReactNode;
}

const defaultClassName = "p-2 border border-gray-500 hover:border-foreground focus:border-primary border-solid rounded shadow";
export default function Select<T>(props: SelectProps<T>) {
    const theme = useTheme();
    const offGray = theme == 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-300';

    const [isOpen, setOpen] = useState(false);
    const { className: propsClass, items, renderItem, renderValue, value, onChange, ...rest } = props;
    const className = useMemo(() => `${defaultClassName} ${propsClass}`, [propsClass]);

    const onItemClicked = useCallback((e: React.MouseEvent, item: T) => {
        e.stopPropagation();
        if (value !== item) onChange(item);

        setOpen(false);
    }, [value, onChange]);

    return <div tabIndex={0} className={className} {...rest} onClick={() => setOpen(true)} onBlur={() => setOpen(false)}>
        {value && renderValue(value)}
        {isOpen && <div className="relative z-10">
            <div className="absolute -top-2 -left-6 -right-6 bg-background shadow max-h-60 overflow-y-auto rounded">
                {items.map((item, i) => <div key={i} onClick={(e) => onItemClicked(e, item)} className={`p-2 ${offGray} ${item === value && 'bg-gray-300'}`}>
                    {renderItem(item, item === value)}
                </div>)}
            </div>
        </div>}
    </div>;
}