import { Button, makeStyles, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import React, { useCallback, useState } from 'react';
import { collect } from 'react-recollect';
import ListOptionToggle from '../components/ListOptionToggle';
import { useResult } from '../hooks/promise';
import { getDb } from '../services/db';
import { CollectProps } from '../types/RecollectStore';

interface CleanSettings {
    articles?: boolean;
    subscriptions?: boolean;
}

const useStyles = makeStyles(theme => ({
    deleteButton: {
    }
}));

export default collect(({ store }: CollectProps) => {
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
        const { friendlyBytes } = await import('../utils/bytes');
        return `Currently using ${friendlyBytes(estimate.usage)} of storage.`
    }, [store.entries], "Calculating storage usage...");

    const articles = useResult(async () => {
        const db = await getDb();
        const count = await db.entries.count();
        return count + "";
    }, [store.entries], '{calculating}')

    const deleteStorage = useCallback(async () => {
        const db = await getDb();
        if (clean.articles || clean.subscriptions) {
            db.entries.clear();
            store.stream = {
                id: 'unknown stream',
                lastScrollPos: 0,
                length: 0,
                loadedEntries: [],
                unreadOnly: true,
            };
            store.entries = {};
        }

        if (clean.subscriptions) {
            store.subscriptions = [];
            store.stream = {
                id: undefined,
                unreadOnly: true,
                lastScrollPos: 0,
                length: 0,
                loadedEntries: []
            };
            db.subscriptions.clear();
        }
    }, [clean]);

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
                secondaryText={`Delete ${articles} downloaded articles. Note: Some may come back on the next sync.`} />
            <ListOptionToggle
                value={clean.subscriptions}
                onChange={onChange}
                name="subscriptions"
                primaryText="Delete Subscriptions"
                secondaryText="Warning! This will delete all your subscriptions. It is not recommended." />
        </List>
        <Button variant="contained" className={styles.deleteButton} onClick={deleteStorage}>
            Clean
        </Button>
    </div>;
});