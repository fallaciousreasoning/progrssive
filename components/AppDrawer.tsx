import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { GetApp, Help } from '@material-ui/icons';
import Book from '@material-ui/icons/Book';
import RssFeed from '@material-ui/icons/RssFeed';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useCallback, useMemo, useState } from 'react';
import ListLinkButton from './ListLinkButton';
import useInstallPrompt from '../hooks/useInstallPrompt';

export default (props: { trigger: JSX.Element }) => {
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
            <div style={{ width: '250px', margin: '10px' }}>
                <Typography variant='h5'>
                    Progrssive Reader
                </Typography>
                <List>
                    <ListLinkButton icon={<Book />} text="Articles" href="/stream/all" />
                    <ListLinkButton icon={<RssFeed />} text="Subscriptions" href="/subscriptions" />
                    <ListLinkButton icon={<SettingsIcon />} text="Settings" href="/settings" />
                    <ListLinkButton icon={<Help />} text="About" href="/about" />
                    {installPrompt && <ListItem button onClick={installPrompt}>
                        <ListItemIcon>
                            <GetApp />
                        </ListItemIcon>
                        <ListItemText primary="Install" />
                    </ListItem>}
                </List>
            </div>
        </Drawer>
    </div>;
}