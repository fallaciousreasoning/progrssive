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
                onClick={() => props.onChange("feedly")}>Feedly</MenuItem>
            <MenuItem
                selected={props.value === "mozilla"}
                onClick={() => props.onChange("mozilla")}>Mozilla</MenuItem>
            <MenuItem
                selected={props.value === "browser"}
                onClick={() => props.onChange("browser")}>Browser</MenuItem>
        </Menu>
    </div>
}