import { IconButton, MenuItem } from "@material-ui/core";
import { ViewArray } from "@material-ui/icons";
import React, { useCallback } from "react";
import ToggleMenu from "./ToggleMenu";

interface Props {
    value: 'feedly' | 'mozilla' | 'browser';
    onChange: (value: 'feedly' | 'mozilla' | 'browser') => void;
}

export default (props: Props) => {
    const onChange = props.onChange;
    const menuItemClicked = useCallback((e) => {
        const value = e.target.getAttribute('value');
        onChange(value);
    }, [onChange]);

    return <div>
        <ToggleMenu trigger={
        <IconButton>
            <ViewArray />
        </IconButton>}>
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
        </ToggleMenu>
    </div>
}