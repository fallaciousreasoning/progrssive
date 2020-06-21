import { IconButton, makeStyles } from '@material-ui/core';
import { RemoveRedEye } from '@material-ui/icons';
import * as React from 'react';
import { useCallback } from 'react';
import { setUnread } from './actions/marker';
import { Entry } from './model/entry';
import { useUnread } from './hooks/unread';

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
    }, [props.entry]);
    const unread = useUnread(props.entry);

    return <IconButton
        className={unread ? styles.on : styles.off}
        onClick={toggleRead}>
        <RemoveRedEye/>
    </IconButton>;
}