import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    clickable: {
        cursor: 'pointer'
    }
});

type Props = {
    icon?: any,
    text: string,
    href: string
};
export default function ListLinkButton(props: Props) {
    const styles=  useStyles();
    return <Link href={props.href}>
        <ListItem className={styles.clickable}>
            {props.icon && <ListItemIcon>
                {props.icon}
            </ListItemIcon>}
            <ListItemText primary={props.text} />
        </ListItem>
    </Link>;
}