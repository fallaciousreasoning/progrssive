import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Install from '../icons/install.svg'
import About from '../icons/about.svg';
import Articles from '../icons/articles.svg';
import Subscriptions from '../icons/subscriptions.svg';
import Settings from '../icons/settings.svg';
import React, { useCallback, useMemo, useState } from 'react';
import ListLinkButton from './ListLinkButton';
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
                <Typography variant='h5'>
                    Progrssive Reader
                </Typography>
                <List>
                    <ListLinkButton icon={<Articles {...iconProps} />} text="Articles" href="/stream/all" />
                    <ListLinkButton icon={<Subscriptions {...iconProps} />} text="Subscriptions" href="/subscriptions" />
                    <ListLinkButton icon={<Settings {...iconProps} />} text="Settings" href="/settings" />
                    <ListLinkButton icon={<About {...iconProps} />} text="About" href="/about" />
                    {installPrompt && <ListItem button onClick={installPrompt}>
                        <ListItemIcon>
                            <Install {...iconProps} />
                        </ListItemIcon>
                        <ListItemText primary="Install" />
                    </ListItem>}
                </List>
            </div>
        </Drawer>
    </div>;
};
