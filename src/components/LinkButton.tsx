import React, { useCallback, MouseEvent } from 'react'
import { ButtonProps, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom';

export default (props: ButtonProps & { href: string, replace?: boolean }) => {
    const history = useHistory();
    const onClick = useCallback((e: React.MouseEvent) => {
        if (e.ctrlKey || e.metaKey || e.button === 3)
            return;

        e.preventDefault();

        if (!props.replace)
            history.push(props.href);
        else history.replace(props.href);

        if (props.onClick)
            props.onClick(e as any);
    }, [props.href, history, props.onClick]);
    
    return <Button {...props} onClick={onClick}/>
}