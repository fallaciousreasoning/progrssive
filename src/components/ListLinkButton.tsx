import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

type Props = {
    icon?: any,
    text: string,
    href: string
};
export default (props: Props) => {
    const history = useHistory();
    return <ListItem button onClick={() => history.push(props.href)}>
        {props.icon && <ListItemIcon>
            {props.icon}
        </ListItemIcon>}
        <ListItemText primary={props.text} />
    </ListItem>;
}