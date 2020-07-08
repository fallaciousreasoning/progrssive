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