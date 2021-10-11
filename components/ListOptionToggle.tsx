import React, { useCallback } from 'react';
import Toggle from 'components/Toggle';
import ListItem from 'components/ListItem'

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
    return <ListItem primary={props.primaryText} secondary={props.secondaryText} onTextClick={toggleManual}>
        <Toggle checked={props.value} onChange={props.onChange} name={props.name} /> 
    </ListItem>;
}