import { IconButton, makeStyles } from '@material-ui/core';
import { RemoveRedEye } from '@material-ui/icons';
import * as React from 'react';
import { useCallback } from 'react';
import { setUnread } from './actions/marker';
import { Entry } from './model/entry';
import { useEntry } from './hooks/entry';

const useStyles = makeStyles({
    on: {
        color: 'white !important'
    },
    off: {
        color: 'gray !important'
    }
})

interface MarkerButtonProps {
    entryId: string;
}

export const EntryReadButton = (props: MarkerButtonProps) => {
    const styles = useStyles(undefined);
    const entry = useEntry(props.entryId);
    const toggleRead = useCallback(() => {
        setUnread(entry, !entry.unread);
    }, [entry]);

    return <IconButton
        className={entry && entry.unread ? styles.on : styles.off}
        onClick={toggleRead}>
        <RemoveRedEye/>
    </IconButton>;
}