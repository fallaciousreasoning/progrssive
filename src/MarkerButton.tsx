import * as React from 'react';
import { Button, IconButton } from '@material-ui/core';
import { Entry } from './model/entry';
import { RemoveRedEye, RemoveCircleOutline, StarSharp, StarOutlined, StarBorderOutlined, Star } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { useCallback } from 'react';
import { isSaved } from './services/entry';
import { setUnread, setSaved } from './actions/marker';

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

export const EntrySavedButton = (props: MarkerButtonProps) => {
    const styles = useStyles(undefined);
    const saved = isSaved(props.entry);
    
    const toggleSaved = useCallback(() => {
        setSaved(props.entry, !saved);
    }, [props.entry, saved]);
    return <IconButton className={styles.on}
        onClick={toggleSaved}>
        {saved
            ? <Star/>
            : <StarBorderOutlined/>}
    </IconButton>
}