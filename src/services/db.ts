import Dexie, { DexieError } from 'dexie';
import { Entry } from '../model/entry';
import { StoreStream } from '../types/RecollectStore';
import { Stream } from '../model/stream';

type DBStream = Omit<Stream, 'items'>;

export class DB extends Dexie {
    entries: Dexie.Table<Entry & { streamIds: string[] }, string>;
    streams: Dexie.Table<DBStream, string>;

    constructor() {
        super('articles');
        this.version(1)
            .stores({
                streams: 'id,title',
                entries: 'id,title,author,published,unread,*streamIds',
                subscriptions: '',
            })
    }
}

export const db = new DB();

export const addStream = (stream: Stream) => {
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
                addEntry(entry, stream.id);
            }
        })
}

export const loadEntry = (entryId: string) => db.entries.get(entryId);

// Ensure we don't lose any stream ids when we save an entry.
export const addEntry = async (entry: Entry, streamId?: string) => {
    // Ensure we don't lose any streamIds
    const oldEntry = await db.entries.get(entry.id);
    const streamIds = new Set(oldEntry.streamIds);
    
    if (streamId)
        streamIds.add(streamId);

    const dbEntry = {
        ...entry,
        streamIds: Array.from(streamIds)
    }

    // Add the entry to the database.
    db.entries.put(dbEntry, entry.id);

    // Return it, on the off chance anyone was interested.
    return dbEntry;
}