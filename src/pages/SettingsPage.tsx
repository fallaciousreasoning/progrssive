import { Divider, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Switch, Select, MenuItem, TypographyProps } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import * as React from 'react';
import { useCallback } from 'react';
import { updateSettings } from '../actions/settings';
import { useStore } from '../hooks/store';
import { green } from '@material-ui/core/colors';
import { accentColors } from '../theme';

const useStyles = makeStyles(theme => ({
    slider: {
        width: '48px !important'
    },
    picker: {
        minWidth: theme.spacing(15)
    },
    colorPickerItem: {
        width: '48px',
        height: '48px'
    },
    colorPickerValue: {
        width: '100%',
        height: '1em'
    }
}));

const primaryTypographyProps: TypographyProps = {
    color: 'textPrimary'
};

export default (props) => {
    const styles = useStyles();
    const store = useStore();

    const onSwitchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>, value: boolean) => {
        const setting = e.target['name'];
        updateSettings(setting as any, value)
    }, []);

    const onPickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const setting = e.target['name'];
        updateSettings(setting as any, e.target.value);
    }, []);

    const onFontSizeChange = useCallback((e: React.ChangeEvent<{}>, value: any) => {
        updateSettings('fontSize', value);
    }, []);

    return <div>
        <List>
            <ListItem>
                <ListItemText
                    primaryTypographyProps={primaryTypographyProps}
                    primary='Read opened articles'
                    secondary='Marks articles as read when you open them.' />
                <ListItemSecondaryAction>
                    <Switch
                        checked={store.settings.markOpenedAsRead}
                        name='markOpenedAsRead'
                        onChange={onSwitchChange} />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText
                    primaryTypographyProps={primaryTypographyProps}
                    primary='Auto mark as read'
                    secondary='Marks articles as read when you scoll past them.' />
                <ListItemSecondaryAction>
                    <Switch checked={store.settings.markScrolledAsRead}
                        name='markScrolledAsRead'
                        onChange={onSwitchChange} />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText
                    primaryTypographyProps={primaryTypographyProps}
                    primary='Double tap to close articles'
                    secondary='Whether articles can be closed by double tapping them.' />
                <ListItemSecondaryAction>
                    <Switch checked={store.settings.doubleTapToCloseArticles}
                        name='doubleTapToCloseArticles'
                        onChange={onSwitchChange} />
                </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText
                    primaryTypographyProps={primaryTypographyProps}
                    primary="Article Text Size"
                    secondary="Controls the size of the article text" />
                <ListItemSecondaryAction>
                    <Slider
                        className={styles.slider}
                        min={1}
                        max={5}
                        step={1}
                        onChange={onFontSizeChange}
                        value={store.settings.fontSize} />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText
                    primaryTypographyProps={primaryTypographyProps}
                    primary="Theme"
                    secondary="Toggle between light and dark mode." />
                <ListItemSecondaryAction>
                    <Select
                        className={styles.picker}
                        name="theme"
                        variant="outlined"
                        onChange={onPickerChange}
                        value={store.settings.theme || "device"}>
                        <MenuItem value="device">Device</MenuItem>
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                    </Select>
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText
                    primaryTypographyProps={primaryTypographyProps}
                    primary="Accent color"
                    secondary="The primary accent color of the app." />
                <ListItemSecondaryAction>
                    <Select
                        name="accent"
                        variant="outlined"
                        onChange={onPickerChange}
                        className={styles.picker}
                        value={store.settings.accent || green[500]}
                        renderValue={(value: string) => <div className={styles.colorPickerValue} style={{background: value }}/>}>
                        {accentColors.map(c => <MenuItem value={c} key={c}>
                            <div style={{ background: c }} className={`${styles.colorPickerItem} color`}></div>
                        </MenuItem>)}
                    </Select>
                </ListItemSecondaryAction>
            </ListItem>
        </List>
    </div>;
}