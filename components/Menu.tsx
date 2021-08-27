import React, { useCallback, useRef } from "react";
import { useEffect } from "react";

interface MenuItemProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    selected?: boolean;
    value?: string;
}

export function MenuItem(props: MenuItemProps) {
    return <div className={`p-2 hover:bg-input flex items-stretch flex-col ${props.selected && 'bg-input'}`} {...props} />;
}

interface Props {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    children: React.ReactElement<MenuItemProps>[];
}

export default function Menu(props: Props) {
    const ref = useRef<HTMLDivElement>();
    useEffect(() => {
        if (!props.isOpen) return;

        ref.current?.focus();
    }, [props.isOpen]);

    const onItemClicked = useCallback((e: React.MouseEvent<HTMLDivElement>, element: React.ReactElement<MenuItemProps>) => {
        element.props.onClick?.(e);
        props.setOpen(false);
    }, []);

    return props.isOpen && <div ref={ref} tabIndex={0} onBlur={() => props.setOpen(false)} >
        <div className="relative z-10">
            <div className="absolute -top-2 -left-6 -right-6 bg-background max-h-60 overflow-y-auto rounded shadow-md">
                {React.Children.map(props.children, (child) => <MenuItem {...child.props} onClick={e => onItemClicked(e, child)} />)}
            </div>
        </div>
    </div>
}