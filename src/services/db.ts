import Dexie from 'dexie';
import { Entry } from '../model/entry';
import { Stream } from '../model/stream';

type DBStream = Omit<Stream, 'items'>;
export type DBEntry = Omit<Entry, 'unread'> & {
    unread: number,
};

export class DB extends Dexie {
    entries: Dexie.Table<DBEntry, string>;
    streams: Dexie.Table<DBStream, string>;

    constructor() {
        super('articles');
        this.version(1)
            .stores({
                streams: '&id,title',
                entries: '&id,title,published,unread,*streamIds',
            });

        this.entries = this.table('entries');
        this.streams = this.table('streams');
    }
}

export const db = new DB();
window['db'] = db;

export const addStream = (stream: Stream) => {
    // Ensure all entries have their streamId attached.
    for (const entry of stream.items) {
        if (!entry.streamIds)
            entry.streamIds = [];
        entry.streamIds.push(stream.id);
    }

    return db.transaction('rw',
        db.entries,
        db.streams,
        async (transaction) => {
            const dbStream = { ...stream };
            delete dbStream.items;

            // Add the stream, sans the items.
            db.streams.put(dbStream, stream.id);

            // Add all the entries
            for (const entry of stream.items) {
                addEntry(entry, true);
            }
        })
}

export const loadEntry = (entryId: string) => entryId ? db.entries.get(entryId) : Promise.resolve(undefined);

type EntryListener = (oldEntry: DBEntry, newEntry: DBEntry) => void;
const entryListeners: EntryListener[] = [];
export const addEntryListener = (listener: EntryListener) => {
    entryListeners.push(listener);
}

export const removeEntryListener = (listener: EntryListener) => {
    const index = entryListeners.indexOf(listener);
    entryListeners.splice(index, 1);
}

// Ensure we don't lose any stream ids when we save an entry.
export const addEntry = async (entry: Partial<Entry>, maintainUnread?: boolean) => {
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

    // Notify listeners of the change.
    for (const listener of entryListeners)
        listener(oldEntry, dbEntry);

    // Return it, on the off chance anyone was interested.
    return dbEntry;
}