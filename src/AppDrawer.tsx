import { Drawer, List, Typography } from "@material-ui/core";
import { Book, RssFeed } from '@material-ui/icons';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useState } from 'react';
import ListLinkButton from './components/ListLinkButton';

export default (props: { trigger: JSX.Element }) => {
    const [open, setOpen] = useState(false);

    return <div>
        {React.cloneElement(props.trigger, { onClick: () => setOpen(true) })}
        <Drawer open={open} onClose={() => setOpen(false)}>
            <div style={{ width: '250px', margin: '10px' }}>
                <Typography variant='h5'>
                    Progrssive Reader
                </Typography>
                <List>
                    <ListLinkButton icon={<Book/>} text="Articles" href="/" />
                    <ListLinkButton icon={<RssFeed/>} text="Subscriptions" href="/subscriptions"/>
                    <ListLinkButton icon={<SettingsIcon/>} text="Settings" href="/settings"/>
                </List>
            </div>
        </Drawer>
    </div>;
}