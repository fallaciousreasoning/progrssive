import * as React from 'react';
import { makeStyles, Button, IconButton } from '@material-ui/core';
import { Entry } from './model/entry';
import { RemoveRedEye, RemoveCircleOutline, StarSharp, StarOutlined, StarBorderOutlined, Star } from '@material-ui/icons';
import { useCallback } from 'react';
import { isSaved } from './services/entry';
import { setUnread } from './actions/marker';

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
    const styles = useStyles(undefined);
    const toggleRead = useCallback(() => {
        setUnread(props.entry, !props.entry.unread);
    }, [props.entry, props.entry.unread]);

    return <IconButton
        className={props.entry.unread ? styles.on : styles.off}
        onClick={toggleRead}>
        <RemoveRedEye/>
    </IconButton>;
}