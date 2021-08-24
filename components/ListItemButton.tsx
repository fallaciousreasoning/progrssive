import Link from 'next/link';
import * as React from 'react';

type ListItemProps = {
    text: string;
    icon: React.ReactNode;
} & ({ onClick: (e: React.MouseEvent<HTMLLIElement>) => void }
    | { href: string }
    | {});

export default function ListButton(props: ListItemProps) {
    const content = <li className="cursor-pointer hover:bg-gray-300 flex flex-row p-2 space-x-3" onClick={props['onClick']}>
        {props.icon}
        <span className="text-base">{props.text}</span>
    </li>;

    return 'href' in props ? <Link href={props.href}>{content}</Link> : content;
}