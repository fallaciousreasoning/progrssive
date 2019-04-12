import * as React from 'react';
import { Button, IconButton } from '@material-ui/core';
import { Entry } from './model/entry';
import { RemoveRedEye, RemoveCircleOutline } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { useCallback } from 'react';
import { updateRead } from './api/markers';

const useStyles = makeStyles({
    on: {
        color: 'white !important'
    },
    off: {
        color: 'gray !important'
    }
})

interface MarkerButtonProps {
    entry: Entry;
}

export const EntryReadButton = (props: MarkerButtonProps) => {
    const styles = useStyles();
    const onClick = useCallback(() => {
        props.entry.unread = !props.entry.unread;
        updateRead(props.entry, !props.entry.unread);
    }, [props.entry, props.entry.unread]);

    return <IconButton
        className={props.entry.unread ? styles.on : styles.off}
        onClick={onClick}>
        <RemoveRedEye/>
    </IconButton>;
}