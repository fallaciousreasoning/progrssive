import IconButton from './IconButton';
import { MenuItem } from './Menu';
import React, { useState, useCallback } from 'react';
import { markStreamAs } from '../services/store';
import ProgressRing from './ProgressRing';
import ToggleMenu from './ToggleMenu';
import LoadingSpinner from './LoadingSpinner';

export default (props: {
    progress: number,
    text?: string,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const markStream = useCallback(async e => {
        const as = e.target.getAttribute('value');
        setIsLoading(true);

        await markStreamAs(as);

        setIsLoading(false);
        window.snackHelper.enqueueSnackbar(`Marked stream as ${as}`);
    }, []);

    return isLoading
        ? <LoadingSpinner size={6} color="text-secondary" />
        : <ToggleMenu trigger={<IconButton className="p-1">
            <ProgressRing key="progress"
                percent={props.progress}
                text={props.text} />
        </IconButton>}>
            <MenuItem value='read' onClick={markStream}>
                Mark Stream as Read
            </MenuItem>
            <MenuItem value="unread" onClick={markStream}>
                Mark Stream as Unread
            </MenuItem>
        </ToggleMenu>;
}