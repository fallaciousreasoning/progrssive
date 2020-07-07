import { IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import * as React from 'react';
import { useCallback } from 'react';
import { setUnread } from './actions/marker';
import { useEntry } from './hooks/entry';

interface MarkerButtonProps {
    entryId: string;
}

export const EntryReadButton = (props: MarkerButtonProps) => {
    const entry = useEntry(props.entryId);
    const toggleRead = useCallback(() => {
        setUnread(entry, !entry.unread);
    }, [entry]);

    return <IconButton onClick={toggleRead}>
        {entry.unread ? <Visibility /> : <VisibilityOff />}
    </IconButton>;
}