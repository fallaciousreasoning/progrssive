import { Divider, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, MenuItem, Select, Switch, TypographyProps, Typography, SelectProps } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import * as React from 'react';
import { useCallback } from 'react';
import { updateSettings } from '../actions/settings';
import { useStore } from '../hooks/store';
import { accentColors, supportedFonts, fonts, getColor } from '../theme';
import { Settings } from '../types/RecollectStore';

const useStyles = makeStyles(theme => ({
    slider: {
        width: '48px !important'
    },
    picker: {
        width: theme.spacing(20),
        "&>div>*": {
            overflow: 'hidden'
        }
    }
}));

const useAccentColorPickerStyles = makeStyles(theme => ({
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

const AccentColorPicker = (props: {
    name: keyof Settings,
} & SelectProps) => {
    const store = useStore();
    const styles = useAccentColorPickerStyles();

    return <Select
        variant="outlined"
        {...props}
        value={store.settings[props.name]}
        renderValue={(value: string) => <div className={styles.colorPickerValue} style={{ background: getColor(value as any) }} />}>
        {accentColors.map(c => <MenuItem value={c} key={c}>
            <div style={{ background: getColor(c as any) }} className={`${styles.colorPickerItem} color`}></div>
        </MenuItem>)}
    </Select>
}

const FontPicker = (props: SelectProps) => {
    const store = useStore();
    
    return <Select
        variant="outlined"
        value={store.settings[props.name]}
        {...props}
        renderValue={(value: string) => <div>{value}</div>}>
        {supportedFonts.map(f => <MenuItem key={f} value={f} style={{ fontFamily: fonts[f] }}>
            {f} | The quick brown fox jumps over the lazy dog.
        </MenuItem>)}
    </Select>
}

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
                    <AccentColorPicker className={styles.picker} name="accent" onChange={onPickerChange} />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText
                    primaryTypographyProps={primaryTypographyProps}
                    primary="Secondary color"
                    secondary="The secondary accent color of the app." />
                <ListItemSecondaryAction>
                    <AccentColorPicker
                        className={styles.picker}
                        name="secondaryAccent"
                        onChange={onPickerChange} />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText
                    primaryTypographyProps={primaryTypographyProps}
                    primary="Article Font"
                    secondary="The font used to display articles." />
                <ListItemSecondaryAction>
                    <FontPicker
                        className={styles.picker}
                        name="fontFamily" 
                        onChange={onPickerChange}/>
                </ListItemSecondaryAction>
            </ListItem>
        </List>
    </div>;
}