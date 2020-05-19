import * as React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router-dom';

type Props = RouteComponentProps & {
    icon?: any,
    text: string,
    href: string
};
const ListLinkButton = (props: Props) => <ListItem button onClick={() => props.history.push(props.href)}>
    {props.icon && <ListItemIcon>
        {props.icon}
    </ListItemIcon>}
    <ListItemText primary={props.text}/>
</ListItem>;

export default withRouter(ListLinkButton);