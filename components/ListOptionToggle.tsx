import { ListItem, ListItemText } from "@material-ui/core";
import React, { useCallback } from 'react';
import Toggle from 'components/Toggle';

export default function ListOptionToggle(
    props: {
        name?: string;
        primaryText: string;
        secondaryText: string;
        value: boolean;
        onChange: (e: React.ChangeEvent<HTMLInputElement>, value: boolean) => void;
    }
) {
    const toggleManual = useCallback((e: React.MouseEvent) => {
        e.target['name'] = props.name;
        props.onChange(e as any, !props.value)
    }, [props.name, props.onChange, props.value]);
    return <ListItem>
        <ListItemText onClick={toggleManual} primary={props.primaryText} secondary={props.secondaryText} />
        <Toggle checked={props.value} onChange={props.onChange} name={props.name} /> 
    </ListItem>;
}