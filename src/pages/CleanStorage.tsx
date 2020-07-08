import List from '@material-ui/core/List';
import React, { useState, useCallback } from 'react';
import ListOptionToggle from '../components/ListOptionToggle';
import { Typography, Button, makeStyles } from '@material-ui/core';
import { useResult } from '../hooks/promise';
import { useStore } from '../hooks/store';

interface CleanSettings {
    articles?: boolean;
    subscriptions?: boolean;
}

const useStyles = makeStyles(theme => ({
    deleteButton: {
        background: theme.palette.error.main
    }
}));

export default (props) => {
    const store = useStore();
    const styles = useStyles();
    const [clean, setClean] = useState<CleanSettings>({ articles: true });
    const onChange = useCallback((e, value) => {
        setClean({
            ...clean,
            [e.target.name]: value
        });
    }, [clean]);

    const usage = useResult(async () => {
        const estimate = await navigator.storage.estimate();
        const {friendlyBytes} = await import('../utils/bytes');
        return `Currently using ${friendlyBytes(estimate.usage)} of storage.`
    }, [], "Calculating storage usage...");

    return <div>
        <Typography variant="h4">
            Clean up storage space.
        </Typography>
        <Typography variant="subtitle2">
            {usage}
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
        <Button variant="contained" className={styles.deleteButton}>
            Clean
        </Button>
    </div>;
}