import * as React from 'react';
import { Button, IconButton } from '@material-ui/core';
import { Entry } from './model/entry';
import { RemoveRedEye, RemoveCircleOutline, StarSharp, StarOutlined, StarBorderOutlined, Star } from '@material-ui/icons';
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
    const toggleRead = useCallback(() => {
        props.entry.unread = !props.entry.unread;
        updateRead(props.entry, !props.entry.unread);
    }, [props.entry, props.entry.unread]);

    return <IconButton
        className={props.entry.unread ? styles.on : styles.off}
        onClick={toggleRead}>
        <RemoveRedEye/>
    </IconButton>;
}

const isSaved = (entry: Entry) => false;
export const EntrySavedButton = (props: MarkerButtonProps) => {
    const styles = useStyles();
    const toggleSaved = useCallback(() => {

    }, [props.entry]);
    const saved = isSaved(props.entry);
    return <IconButton className={styles.on}
        onClick={toggleSaved}>
        {saved
            ? <Star/>
            : <StarBorderOutlined/>}
    </IconButton>
}