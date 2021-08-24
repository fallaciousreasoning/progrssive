import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import Link from 'next/link';

type Props = {
    icon?: any,
    text: string,
    href: string
};
export default function ListLinkButton(props: Props) {
    return <Link href={props.href}>
        <ListItem className="cursor-pointer hover:bg-gray-300">
            {props.icon && <ListItemIcon>
                {props.icon}
            </ListItemIcon>}
            <ListItemText primary={props.text} />
        </ListItem>
    </Link>;
}