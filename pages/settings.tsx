import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select, { SelectProps } from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useCallback } from 'react';
import { collect } from 'react-recollect';
import { defaultSettings, updateSettings } from '../actions/settings';
import LinkButton from '../components/LinkButton';
import ListOptionToggle from '../components/ListOptionToggle';
import { useResult } from '../hooks/promise';
import { accentColors, fonts, getColor, supportedFonts } from '../styles/theme';
import { CollectProps, Settings } from '../types/RecollectStore';

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

const AccentColorPicker = collect((props: {
    name: keyof Settings
} & SelectProps & CollectProps) => {
    const styles = useAccentColorPickerStyles();

    return <Select
        native={false}
        variant="outlined"
        {...props}
        value={props.store.settings[props.name]}
        renderValue={(value: unknown) => <div className={styles.colorPickerValue} style={{ background: getColor(value as any) }} />}>
        {accentColors.map(c => <MenuItem value={c} key={c}>
            <div style={{ background: getColor(c as any) }} className={`${styles.colorPickerItem} color`}></div>
        </MenuItem>)}
    </Select>
});

const FontPicker = collect((props: SelectProps & CollectProps) => <Select
        variant="outlined"
        value={props.store.settings[props.name]}
        {...props}
        renderValue={(value: unknown) => <div>{value}</div>}>
        {supportedFonts.map(f => <MenuItem key={f} value={f} style={{ fontFamily: fonts[f] }}>
            {f} | The quick brown fox jumps over the lazy dog.
        </MenuItem>)}
    </Select>)

const CleanupPicker = collect((props: {
    name: keyof Settings['cleanupSettings'];
} & SelectProps & CollectProps) => {
    const cleanupSettings = props.store.settings.cleanupSettings || defaultSettings.cleanupSettings;
    const value = cleanupSettings[props.name];

    const onChange = useCallback(e => {
        updateSettings("cleanupSettings", {
            ...cleanupSettings,
            [props.name]: e.target.value
        })
    }, [props.name, cleanupSettings]);

    return <Select
        variant="outlined"
        {...props}
        onChange={onChange}
        value={value}>
        <MenuItem value="never">Never</MenuItem>
        <MenuItem value={1}>1 day</MenuItem>
        <MenuItem value={3}>3 days</MenuItem>
        <MenuItem value={7}>1 week</MenuItem>
        <MenuItem value={14}>2 weeks</MenuItem>
        <MenuItem value={21}>3 weeks</MenuItem>
        <MenuItem value={28}>4 weeks</MenuItem>
    </Select>
});

const SettingsPage = collect(({ store }: CollectProps) => {
    const styles = useStyles();
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

    const storageUsage = useResult(async () => {
        const estimate = await navigator.storage.estimate();
        const { friendlyBytes } = await import('../utils/bytes');
        return `Currently using ${friendlyBytes(estimate.usage)} of storage.`;
    }, [store.entries], "Calculating....")

    return <div>
        <List>
            <ListOptionToggle
                primaryText='Read opened articles'
                secondaryText='Mark articles as read when you open them.'
                name='markOpenedAsRead'
                value={store.settings.markOpenedAsRead}
                onChange={onSwitchChange} />
            <ListOptionToggle
                primaryText='Auto mark as read'
                secondaryText='Mark articles as read when you scroll past them.'
                name='markScrolledAsRead'
                value={store.settings.markScrolledAsRead}
                onChange={onSwitchChange} />
            <ListOptionToggle
                primaryText='Double tap to close articles'
                secondaryText='Whether articles can be closed by double tapping them.'
                name='doubleTapToCloseArticles'
                value={store.settings.doubleTapToCloseArticles}
                onChange={onSwitchChange} />
            <Divider />
            <ListItem>
                <ListItemText
                    primary="Article Text Size"
                    secondary="Controls the size of the article text" />
                <Slider
                    className={styles.slider}
                    min={1}
                    max={5}
                    step={1}
                    onChange={onFontSizeChange}
                    value={store.settings.fontSize} />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Theme"
                    secondary="Toggle between light and dark mode." />
                <Select
                    className={styles.picker}
                    name="theme"
                    variant="outlined"
                    onChange={onPickerChange as any}
                    value={store.settings.theme || "device"}>
                    <MenuItem value="device">Device</MenuItem>
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                </Select>
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Accent color"
                    secondary="The primary accent color of the app." />
                <AccentColorPicker className={styles.picker} name="accent" onChange={onPickerChange} />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Secondary color"
                    secondary="The secondary accent color of the app." />
                <AccentColorPicker
                    className={styles.picker}
                    name="secondaryAccent"
                    onChange={onPickerChange} />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Font"
                    secondary="The font used throughout the application." />
                <FontPicker
                    className={styles.picker}
                    name="fontFamily"
                    onChange={onPickerChange} />
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText
                    primary="Delete Unread Articles"
                    secondary="When unread articles should be deleted" />
                <CleanupPicker
                    className={styles.picker}
                    name="deleteUnreadEntries" />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Delete Read Articles"
                    secondary="When read articles should be deleted" />
                <CleanupPicker
                    className={styles.picker}
                    name="deleteReadEntries" />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Storage"
                    secondary={storageUsage} />
                <LinkButton variant="outlined" color="primary" href="/clean">
                    Clean
                </LinkButton>
            </ListItem>
        </List>
    </div>;
})

export default SettingsPage;