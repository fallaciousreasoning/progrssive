import React, { useState, useRef, useCallback } from 'react'
import { Menu, makeStyles } from '@material-ui/core'

interface Props {
    trigger: React.ReactElement;
    children: React.ReactElement | React.ReactElement[];
}

const anchorOrigin = {
    horizontal: 'center',
    vertical: 'bottom'
} as const;
const transformOrigin = {
    horizontal: 'center',
    vertical: 'top'
} as const;

const useStyles = makeStyles(theme => ({
    triggerSelected: {
        background: theme.palette.background.default,
    },
    trigger: {
        transitionDuration: '0.5s'
    }
}));

export default (props: Props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const triggerRef = useRef();
    const styles = useStyles();

    const toggleMenu = useCallback(() =>
        setAnchorEl(anchorEl ? null : triggerRef.current),
        [anchorEl]);
    const closeMenu = useCallback(() => setAnchorEl(null), []);

    const trigger = React.cloneElement(props.trigger, {
        ...props.trigger.props,
        onClick: toggleMenu,
        ref: triggerRef,
        className: `${props.trigger.props.className} ${styles.trigger} ${!!anchorEl && styles.triggerSelected}`
    });

    const children = (Array.isArray(props.children)
        ? props.children
        : [props.children]).filter(c => c)

    return <>
        {trigger}
        <Menu
            open={!!anchorEl}
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            anchorReference="anchorEl"
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            onClose={closeMenu}
            keepMounted
        >
            {children.map((c, i) => React.cloneElement(c, {
                ...c.props,
                key: i,
                onClick: (...args) => {
                    closeMenu();
                    if (c.props.onClick)
                        c.props.onClick(...args)
                }
            }))}
        </Menu>
    </>
}