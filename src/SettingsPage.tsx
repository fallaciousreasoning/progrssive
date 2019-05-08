import * as React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';

export default (props) => {
    return <div>
        <List>
            <ListItem>
                <ListItemText primary='foo' secondary='bar'/>
            </ListItem>
        </List>
    </div>;
}