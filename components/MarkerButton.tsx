import * as React from 'react';
import { useCallback } from 'react';
import { collect } from 'react-recollect';
import { setUnread } from '../actions/marker';
import { useEntry } from '../hooks/entry';
import MarkRead from '../icons/markread.svg';
import MarkUnread from '../icons/markunread.svg';
import { CollectProps } from '../types/RecollectStore';
import IconButton from './IconButton';

interface MarkerButtonProps {
    entryId: string;
}

export const EntryReadButton = collect((props: MarkerButtonProps & CollectProps) => {
    const entry = useEntry(props.entryId, props.store);
    const toggleRead = useCallback(() => {
        setUnread(entry, !entry.unread);
    }, [entry]);

    return <IconButton onClick={toggleRead}>
        {entry.unread ? <MarkRead /> : <MarkUnread />}
    </IconButton>;
});