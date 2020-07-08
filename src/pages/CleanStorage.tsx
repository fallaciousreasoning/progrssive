import List from '@material-ui/core/List';
import React, { useState, useCallback } from 'react';
import ListOptionToggle from '../components/ListOptionToggle';
import { Typography } from '@material-ui/core';

interface CleanSettings {
    articles?: boolean;
    subscriptions?: boolean;
}

export default (props) => {
    const [clean, setClean] = useState<CleanSettings>({ articles: true });
    const onChange = useCallback((e, value) => {
        setClean({
            ...clean,
            [e.target.name]: value
        });
    }, [clean]);
    return <div>
        <Typography variant="h4">
            Clean up storage space.
        </Typography>
        <List>
            <ListOptionToggle
                value={clean.articles}
                onChange={onChange}
                name="articles"
                primaryText="Delete Articles"
                secondaryText="Delete all downloaded articles. Note: Some may come back on the next sync." />
            <ListOptionToggle
                value={clean.subscriptions}
                onChange={onChange}
                name="subscriptions"
                primaryText="Delete Subscriptions"
                secondaryText="Warning! This will delete all your subscriptions. It is not recommended." />
        </List>
    </div>;
}