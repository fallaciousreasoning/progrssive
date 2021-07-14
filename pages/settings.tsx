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
import { Settings } from '../model/settings';
import { updateSettings } from '../services/settings';
import LinkButton from '../components/LinkButton';
import ListOptionToggle from '../components/ListOptionToggle';
import { useResult } from '../hooks/promise';
import { useSettings } from '../services/settings';
import { fonts, supportedFonts } from '../styles/theme';
import { accentColors, getColorForTheme } from '../styles/colors';
import { useTheme } from '../hooks/responsive';

const useStyles = makeStyles(theme => ({
    picker: {
        "&>div>*": {
            overflow: 'hidden'
        }
    }
}));

const AccentColorPicker = (props: {
    name: keyof Settings
} & SelectProps) => {
    const settings = useSettings();
    const theme = useTheme();

    return <Select
        native={false}
        variant="outlined"
        {...props}
        value={settings[props.name]}
        renderValue={(value: unknown) => <div className="w-full h-4" style={{ background: getColorForTheme(value as any, theme) }} />}>
        {accentColors.map(c => <MenuItem value={c} key={c}>
            <div style={{ background: getColorForTheme(c as any, theme) }} className={`w-12 h-12 color`}></div>
        </MenuItem>)}
    </Select>
};

const FontPicker = (props: SelectProps) => {
    const settings = useSettings();
    return <Select
        variant="outlined"
        value={settings[props.name]}
        {...props}
        renderValue={(value: unknown) => <div>{value}</div>}>
        {supportedFonts.map(f => <MenuItem key={f} value={f} style={{ fontFamily: fonts[f] }}>
            {f} | The quick brown fox jumps over the lazy dog.
        </MenuItem>)}
    </Select>
}

const CleanupPicker = (props: {
    name: keyof Settings['cleanupSettings'];
} & SelectProps) => {
    const settings = useSettings();
    const cleanupSettings = settings.cleanupSettings;
    const value = cleanupSettings[props.name];

    const onChange = useCallback(e => {
        updateSettings({
            ...settings,
            cleanupSettings: {
                ...cleanupSettings,
                [props.name]: e.target.value
            }
        })
    }, [props.name, settings]);

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
};

const SettingsPage = () => {
    const settings = useSettings();
    const styles = useStyles();
    const onSwitchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>, value: boolean) => {
        const setting = e.target['name'];
        updateSettings({
            ...settings,
            [setting]: value
        })
    }, [settings]);

    const onPickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const setting = e.target['name'];
        updateSettings({
            ...settings,
            [setting]: e.target.value
        });
    }, [settings]);

    const onFontSizeChange = useCallback((e: React.ChangeEvent<{}>, value: any) => {
        updateSettings({
            ...settings,
            'fontSize': value
        });
    }, [settings]);

    const storageUsage = useResult(async () => {
        const estimate = await navigator.storage.estimate();
        const { friendlyBytes } = await import('../utils/bytes');
        return `Currently using ${friendlyBytes(estimate.usage)} of storage.`;
    }, [], "Calculating....")

    return <div>
        <List>
            <ListOptionToggle
                primaryText='Read opened articles'
                secondaryText='Mark articles as read when you open them.'
                name='markOpenedAsRead'
                value={settings.markOpenedAsRead}
                onChange={onSwitchChange} />
            <ListOptionToggle
                primaryText='Auto mark as read'
                secondaryText='Mark articles as read when you scroll past them.'
                name='markScrolledAsRead'
                value={settings.markScrolledAsRead}
                onChange={onSwitchChange} />
            <ListOptionToggle
                primaryText='Double tap to close articles'
                secondaryText='Whether articles can be closed by double tapping them.'
                name='doubleTapToCloseArticles'
                value={settings.doubleTapToCloseArticles}
                onChange={onSwitchChange} />
            <Divider />
            <ListItem>
                <ListItemText
                    primary="Article Text Size"
                    secondary="Controls the size of the article text" />
                <Slider
                    className="w-12"
                    min={1}
                    max={5}
                    step={1}
                    onChange={onFontSizeChange}
                    value={settings.fontSize} />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Theme"
                    secondary="Toggle between light and dark mode." />
                <Select
                    className={`${styles.picker} w-40`}
                    name="theme"
                    variant="outlined"
                    onChange={onPickerChange as any}
                    value={settings.theme || "device"}>
                    <MenuItem value="device">Device</MenuItem>
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                </Select>
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Accent color"
                    secondary="The primary accent color of the app." />
                <AccentColorPicker className={styles.picker} name="accent" onChange={onPickerChange as any} />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Secondary color"
                    secondary="The secondary accent color of the app." />
                <AccentColorPicker
                    className={styles.picker}
                    name="secondaryAccent"
                    onChange={onPickerChange as any} />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Font"
                    secondary="The font used throughout the application." />
                <FontPicker
                    className={styles.picker}
                    name="fontFamily"
                    onChange={onPickerChange as any} />
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
};

export default SettingsPage;