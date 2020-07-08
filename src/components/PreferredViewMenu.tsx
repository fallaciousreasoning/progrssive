import { makeStyles, IconButton, Menu, MenuItem } from "@material-ui/core";
import React, { useState, useRef, useCallback } from "react";
import { ViewArray } from "@material-ui/icons";

interface Props {
    value: 'feedly' | 'mozilla' | 'browser';
    onChange: (value: 'feedly' | 'mozilla' | 'browser') => void;
}

const useStyles = makeStyles(theme => ({
    iconButtonSelected: {
        background: theme.palette.background.default,
    },
    iconButton: {
        transitionDuration: '0.5s'
    }
}));
const anchorOrigin = {
    horizontal: 'center',
    vertical: 'bottom'
} as const;
const transformOrigin = {
    horizontal: 'center',
    vertical: 'top'
} as const;

export default (props: Props) => {
    const styles = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const iconButtonRef = useRef();
    const toggleMenu = useCallback(e => {
        setAnchorEl(anchorEl
            ? null
            : iconButtonRef.current);
    }, [anchorEl]);
    const closeMenu = useCallback(() => setAnchorEl(null), []);

    const onChange = props.onChange;
    const menuItemClicked = useCallback((e) => {
        const value = e.target.getAttribute('value');
        onChange(value);
        closeMenu();
    }, [closeMenu, onChange]);

    return <div>
        <IconButton ref={iconButtonRef} className={`${!!anchorEl && styles.iconButtonSelected} ${styles.iconButton}`} onClick={toggleMenu}>
            <ViewArray />
        </IconButton>
        <Menu
            open={!!anchorEl}
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            anchorReference="anchorEl"
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            onClose={closeMenu}
            keepMounted>
            <MenuItem
                selected={props.value === "feedly"}
                value="feedly"
                onClick={menuItemClicked}>Feedly</MenuItem>
            <MenuItem
                selected={props.value === "mozilla"}
                value="mozilla"
                onClick={menuItemClicked}>Mozilla</MenuItem>
            <MenuItem
                selected={props.value === "browser"}
                value="browser"
                onClick={menuItemClicked}>Browser</MenuItem>
        </Menu>
    </div>
}