import Button, { ButtonProps } from '@material-ui/core/Button';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export default (props: ButtonProps & { href: string, replace?: boolean }) => {
    const history = useHistory();
    const { href, replace, onClick } = props;
    const onButtonClick = useCallback((e: React.MouseEvent) => {
        if (e.ctrlKey || e.metaKey || e.button === 3)
            return;

        e.preventDefault();

        if (!replace)
            history.push(href);
        else history.replace(href);

        if (onClick)
            onClick(e as any);
    }, [href, replace, history, onClick]);
    
    return <Button {...props} onClick={onButtonClick}/>
}