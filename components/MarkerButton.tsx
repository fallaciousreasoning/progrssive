import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import * as React from 'react';
import { useCallback } from 'react';
import { collect } from 'react-recollect';
import { setUnread } from '../actions/marker';
import { useEntry } from '../hooks/entry';
import { CollectProps } from '../types/RecollectStore';

interface MarkerButtonProps {
    entryId: string;
}

export const EntryReadButton = collect((props: MarkerButtonProps & CollectProps) => {
    const entry = useEntry(props.entryId, props.store);
    const toggleRead = useCallback(() => {
        setUnread(entry, !entry.unread);
    }, [entry]);

    return <IconButton onClick={toggleRead}>
        {entry.unread ? <Visibility /> : <VisibilityOff />}
    </IconButton>;
});