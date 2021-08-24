import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Install from '../icons/install.svg'
import About from '../icons/about.svg';
import Articles from '../icons/articles.svg';
import Subscriptions from '../icons/subscriptions.svg';
import Settings from '../icons/settings.svg';
import React, { useCallback, useMemo, useState } from 'react';
import ListItemButton from './ListItemButton';
import useInstallPrompt from '../hooks/useInstallPrompt';

const iconProps = { className: "opacity-50", width: 24, height: 24 };
export default function AppDrawer(props: { trigger: JSX.Element }) {
    const [open, setOpen] = useState(false);
    const close = useCallback(() => {
        setOpen(false)
    }, []);

    const triggerProps = useMemo(() => ({
        onClick: () => setOpen(true)
    }), []);

    const installPrompt = useInstallPrompt();

    return <div>
        {React.cloneElement(props.trigger, triggerProps)}
        <Drawer open={open} onClose={close}>
            <div className="m-2 w-64">
                <h5 className="text-xl ml-4">
                    Progrssive Reader
                </h5>
                <ul className="py-2">
                    <ListItemButton icon={<Articles {...iconProps} />} text="Articles" href="/stream/all" />
                    <ListItemButton icon={<Subscriptions {...iconProps} />} text="Subscriptions" href="/subscriptions" />
                    <ListItemButton icon={<Settings {...iconProps} />} text="Settings" href="/settings" />
                    <ListItemButton icon={<About {...iconProps} />} text="About" href="/about" />
                    {installPrompt && <ListItemButton onClick={installPrompt} icon={Install} text="Install"/>}
                </ul>
            </div>
        </Drawer>
    </div>;
};
