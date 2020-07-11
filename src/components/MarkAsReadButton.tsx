import React from 'react';
import { IconButton } from '@material-ui/core';
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
    </ToggleMenu>;
}