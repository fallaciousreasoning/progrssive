import React, { useCallback, useState } from 'react';
import { collect } from 'react-recollect';
import Button from '../components/Button';
import ListOptionToggle from '../components/ListOptionToggle';
import { useResult } from '../hooks/promise';
import { getDb } from '../services/db';
import { CollectProps } from '../types/RecollectStore';

interface CleanSettings {
    articles?: boolean;
    subscriptions?: boolean;
}

export default collect(({ store }: CollectProps) => {
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
                length: 0,
                loadedEntries: [],
                unreadOnly: true,
            };
            store.entries = {};
        }

        if (clean.subscriptions) {
            db.subscriptions.clear();
        }
    }, [clean]);

    return <div>
        <h4 className="text-3xl">Clean up storage space.</h4>
        <span>{usage}</span>
        <ul className="-ml-4 py-1">
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
        </ul>
        <Button variant="outline" onClick={deleteStorage}>
            Clean
        </Button>
    </div>;
});