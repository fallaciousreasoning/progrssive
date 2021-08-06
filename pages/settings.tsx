import Divider from '../components/Divider';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import LinkButton from '../components/LinkButton';
import ListItem from '../components/ListItem';
import ListOptionToggle from '../components/ListOptionToggle';
import Select from '../components/Select';
import { useResult } from '../hooks/promise';
import { useTheme } from '../hooks/responsive';
import { Settings } from '../model/settings';
import { updateSettings, useSettings } from '../services/settings';
import { AccentColor, accentColors, getColorForTheme } from '../styles/colors';
import { fonts, supportedFonts } from '../styles/theme';

const useSettingsUpdater = <T extends keyof Settings>(key: T) => {
    const settings = useSettings();
    return useCallback((newValue: Settings[T]) => updateSettings({ ...settings, [key]: newValue }), [settings, key]);
}

const AccentColorPicker = (props: {
    name: keyof Settings
}) => {
    const settings = useSettings();
    const theme = useTheme();
    const updater = useSettingsUpdater(props.name);
    return <Select
        className="w-52 h-14"
        items={accentColors}
        onChange={updater}
        renderItem={value => <div className="w-10 h-10" style={{ background: getColorForTheme(value as AccentColor, theme) }}></div>}
        renderValue={value => <div className="w-full h-full" style={{ background: getColorForTheme(value as AccentColor, theme) }}></div>}
        value={settings[props.name] as AccentColor} />;
};

const FontPicker = () => {
    const settings = useSettings();
    const updater = useSettingsUpdater('fontFamily');
    return <Select
        className="w-52 text-lg"
        value={settings.fontFamily}
        items={supportedFonts}
        onChange={updater}
        renderValue={value => <div>{value}</div>}
        renderItem={item => <div className="overflow-none" style={{ fontFamily: fonts[item] }}>{item}</div>}
    />;
}

const cleanupSchedules = [
    { days: "never", text: "Never" },
    { days: 1, text: "1 day" },
    { days: 3, text: "3 days" },
    { days: 7, text: "1 week" },
    { days: 14, text: "2 weeks" },
    { days: 21, text: "3 weeks" },
    { days: 28, text: "4 weeks" },
] as const;

const CleanupPicker = (props: {
    name: keyof Settings['cleanupSettings'];
}) => {
    const settings = useSettings();
    const cleanupSettings = settings.cleanupSettings;

    const settingsValue = cleanupSettings[props.name];
    const value = useMemo(() => cleanupSchedules.find(s => s.days === settingsValue) ?? { days: settingsValue, text: `${settingsValue} days` }, [settingsValue]);

    const onChange = useCallback((newValue: { days: "never" | number, text: string }) => {
        updateSettings({
            ...settings,
            cleanupSettings: {
                ...cleanupSettings,
                [props.name]: newValue.days
            }
        })
    }, [props.name, settings]);

    return <Select
        className="text-lg w-52"
        value={value}
        onChange={onChange}
        items={cleanupSchedules as any}
        renderItem={i => <span>{i.text}</span>}
        renderValue={v => <span>{v.text}</span>} />
};

const themeValues = ['device', 'light', 'dark'] as Settings['theme'][];
const SettingsPage = () => {
    const settings = useSettings();
    const onToggleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>, value: boolean) => {
        const setting = e.target['name'];
        updateSettings({
            ...settings,
            [setting]: value
        })
    }, [settings]);

    const onFontSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettings({
            ...settings,
            'fontSize': e.target.value as any
        });
    }, [settings]);

    const storageUsage = useResult(async () => {
        const estimate = await navigator.storage.estimate();
        const { friendlyBytes } = await import('../utils/bytes');
        return `Currently using ${friendlyBytes(estimate.usage)} of storage.`;
    }, [], "Calculating....")

    const onThemeChanged = useSettingsUpdater('theme');

    return <div>
        <ul className="">
            <ListOptionToggle
                primaryText='Read opened articles'
                secondaryText='Mark articles as read when you open them.'
                name='markOpenedAsRead'
                value={settings.markOpenedAsRead}
                onChange={onToggleChange} />
            <ListOptionToggle
                primaryText='Auto mark as read'
                secondaryText='Mark articles as read when you scroll past them.'
                name='markScrolledAsRead'
                value={settings.markScrolledAsRead}
                onChange={onToggleChange} />
            <ListOptionToggle
                primaryText='Double tap to close articles'
                secondaryText='Whether articles can be closed by double tapping them.'
                name='doubleTapToCloseArticles'
                value={settings.doubleTapToCloseArticles}
                onChange={onToggleChange} />
            <Divider />
            <ListItem primary="Article Text Size" secondary="Controls the size of the article text">
                <div className="w-52 self-stretch flex flex-row items-center">
                    <input className="w-full bg-input text-primary" type="range" min={1} max={5} step={1} onChange={onFontSizeChange} value={settings.fontSize}/>
                </div>
            </ListItem>
            <ListItem primary="Theme" secondary="Toggle between light and dark mode.">
                <Select
                    className="w-52 capitalize text-lg"
                    value={settings.theme}
                    items={themeValues}
                    renderItem={i => i}
                    renderValue={i => i}
                    onChange={onThemeChanged}
                />
            </ListItem>
            <ListItem primary="Accent Color" secondary="The primary accent color of the app.">
                <AccentColorPicker name="accent" />
            </ListItem>
            <ListItem primary="Secondary color" secondary="The secondary accent color of the app.">
                <AccentColorPicker name="secondaryAccent" />
            </ListItem>
            <ListItem primary="Font" secondary="The font used throughout the application.">
                <FontPicker />
            </ListItem>
            <Divider />
            <ListItem primary="Delete Unread Articles" secondary="When unread articles should be deleted">
                <CleanupPicker name="deleteUnreadEntries" />
            </ListItem>
            <ListItem primary="Delete Read Articles" secondary="When read articles should be deleted">
                <CleanupPicker name="deleteReadEntries" />
            </ListItem>
            <ListItem primary="Storage" secondary={storageUsage}>
                <LinkButton color="primary" href="/clean">
                    <span className="text-lg">Clean</span>
                </LinkButton>
            </ListItem>
        </ul>
    </div>;
};

export default SettingsPage;