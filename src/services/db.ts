import { Entry } from '../model/entry';
import { Stream } from '../model/stream';
import { DBEntry, DB } from './dbBuilder';
import { Subscription } from '../model/subscription';

let _db;
export const getDb = async (): Promise<DB> => {
    if (!_db) {
        const { DB } = await import('./dbBuilder');
        _db = new DB();
        window['db'] = _db;
    }
    return _db;
}

export const saveSubscription = async (subscription: Subscription, entries: Entry[]=[]) => {
    // Get rid of all the store proxy stuff.
    subscription = JSON.parse(JSON.stringify(subscription));
    
    const db = await getDb();
    return db.transaction('rw',
        db.entries,
        db.subscriptions,
        async (transaction) => {
            // Update/put the subscription.
            db.subscriptions.put(subscription,
                subscription.id);

            // Add all the entries
            for (const entry of entries) {
                addEntry(entry, true);
            }
        })
}

export const loadEntry = async (entryId: string) => {
    if (!entryId)
        return Promise.resolve(undefined);
    const db = await getDb();
    return db.entries.get(entryId);
}

// Ensure we don't lose any stream ids when we save an entry.
export const addEntry = async (entry: Partial<Entry>, maintainUnread?: boolean) => {
    const db = await getDb();

    // Don't save transient entries.
    if (entry.transient)
        return;

    let dbEntry = {
        ...entry,
        unread: +entry.unread,
        streamIds: []
    } as unknown as DBEntry;

    const streamIds = new Set<string>(entry.streamIds || []);
    const oldEntry = await db.entries.get(entry.id);
    if (oldEntry) {
        // Don't lose anything from the old entry.
        dbEntry = {
            ...oldEntry,
            ...dbEntry
        };

        // Ensure we don't lose any streamIds
        for (const s of oldEntry.streamIds)
            streamIds.add(s);

        // Maybe maintain unread information?
        if (maintainUnread) {
            dbEntry.unread = oldEntry.unread;
            dbEntry.readTime = oldEntry.readTime;
        }
    }

    // Set the stream ids.
    dbEntry.streamIds = Array.from(streamIds);

    // Add the entry to the database.
    db.entries.put(dbEntry, entry.id);

    // Return it, on the off chance anyone was interested.
    return dbEntry;
}