import React from 'react';
import { IconButton } from '@material-ui/core';
import ProgressRing from './ProgressRing';

export default (props: {
    progress: number,
    text?: string,
}) => {
    return <IconButton size="small">
        <ProgressRing key="progress"
            percent={props.progress}
            text={props.text} />
    </IconButton>;
}