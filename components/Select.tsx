import Menu, { MenuItem } from 'components/Menu';
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
    const [isOpen, setOpen] = useState(false);
    const { className: propsClass, items, renderItem, renderValue, value, onChange, ...rest } = props;
    const className = useMemo(() => `${defaultClassName} ${propsClass}`, [propsClass]);

    const onItemClicked = useCallback((e: React.MouseEvent, item: T) => {
        if (value !== item) onChange(item);
    }, [value, onChange]);

    return <div tabIndex={0} className={className} {...rest} onFocus={() => setOpen(true)}>
        {value && renderValue(value)}
        <Menu isOpen={isOpen} setOpen={setOpen}>
            {items.map(i => <MenuItem onClick={e => onItemClicked(e, i)} selected={i === value}>{renderItem(i, i === value)}</MenuItem>)}
        </Menu>
    </div>;
}