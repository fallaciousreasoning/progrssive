import * as React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Switch, Divider } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    slider: {
        width: '48px !important'
    }
});

export default (props) => {
    const styles = useStyles();

    return <div>
        <List>
            <ListItem>
                <ListItemText
                    primary='Read opened articles'
                    secondary='Marks articles as read when you open them.'/>
                <ListItemSecondaryAction>
                    <Switch/>
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText
                    primary='Auto mark as read'
                    secondary='Marks articles as read when you scoll past them.'/>
                <ListItemSecondaryAction>
                    <Switch/>
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText
                    primary='Double tap to close articles'
                    secondary='Whether articles can be closed by double tapping them.'/>
                <ListItemSecondaryAction>
                    <Switch/>
                </ListItemSecondaryAction>
            </ListItem>
            <Divider/>
            <ListItem>
                <ListItemText
                    primary="Article Text Size"
                    secondary="Controls the size of the article text"/>
                <ListItemSecondaryAction>
                    <Slider
                        className={styles.slider}
                        min={1}
                        max={5}
                        step={1}
                        onChange={console.log}
                        value={3}/>
                </ListItemSecondaryAction>
            </ListItem>
        </List>
    </div>;
}