import { ListItem, ListItemText, Switch } from "@material-ui/core";
import React from 'react';

const ListOptionToggle = (
    props: {
        name?: string;
        primaryText: string;
        secondaryText: string;
        value: boolean;
        onChange: (e: React.ChangeEvent<HTMLInputElement>, value: boolean) => void;
    }
) => <ListItem>
        <ListItemText primary={props.primaryText} secondary={props.secondaryText} />
        <Switch checked={props.value} onChange={props.onChange} name={props.name} />
    </ListItem>;

export default ListOptionToggle;