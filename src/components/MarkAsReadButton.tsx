import React from 'react';
import { IconButton, MenuItem } from '@material-ui/core';
import ProgressRing from './ProgressRing';
import ToggleMenu from './ToggleMenu';
import { markStreamAsRead } from '../services/store';

export default (props: {
    progress: number,
    text?: string,
}) => {
    return <ToggleMenu trigger={<IconButton size="small">
        <ProgressRing key="progress"
            percent={props.progress}
            text={props.text} />
    </IconButton>}>
        <MenuItem onClick={markStreamAsRead}>
            Mark as Read
        </MenuItem>
    </ToggleMenu>;
}