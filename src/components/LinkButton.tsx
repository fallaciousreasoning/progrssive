import React, { useCallback } from 'react'
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
    }, [props.href, history]);
    return <Button {...props} onClick={onClick}/>
}