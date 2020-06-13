import Dexie, { DexieError } from 'dexie';
import { Entry } from '../model/entry';
import { StoreStream } from '../types/RecollectStore';
import { Stream } from '../model/stream';

type DBStream = Omit<Stream, 'items'>;

class DB extends Dexie {
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

const db = new DB();

export const addStream = (stream: Stream) => {
    return db.transaction('rw',
        db.entries,
        db.streams, async (transaction) => {
            const dbStream = { ...stream };
            delete dbStream.items;

            // Add the stream, sans the items.
            db.streams.put(dbStream, stream.id);

            // Add all the entries
            for (const entry of stream.items) {
                // Ensure we don't lose any streamIds
                const oldEntry = await db.entries.get(entry.id);
                const streamIds = new Set(oldEntry.streamIds);
                streamIds.add(stream.id);

                const dbEntry = {
                    ...entry,
                    streamIds: Array.from(streamIds)
                }

                // Add the entry to the database.
                db.entries.put(dbEntry, entry.id);
            }
    })
}

export const iterateEntries = (streamId?: string) => {
    return db.transaction('r', db.entries, t => {
        if (streamId) {
            db.entries
                .where('categories')
                .equals(streamId)
                // Sadly, this happens in memory..
                .sortBy('published');
        }

        return  db.entries.orderBy('published');
    })
}