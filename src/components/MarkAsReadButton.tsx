import { IconButton, MenuItem } from '@material-ui/core';
import React from 'react';
import { markStreamAs } from '../services/store';
import ProgressRing from './ProgressRing';
import ToggleMenu from './ToggleMenu';

export default (props: {
    progress: number,
    text?: string,
}) => {
    return <ToggleMenu trigger={<IconButton size="small">
        <ProgressRing key="progress"
            percent={props.progress}
            text={props.text} />
    </IconButton>}>
        <MenuItem onClick={() => markStreamAs('read')}>
            Mark as Read
        </MenuItem>
        <MenuItem onClick={() => markStreamAs('unread')}>
            Mark as Unread
        </MenuItem>
    </ToggleMenu>;
}