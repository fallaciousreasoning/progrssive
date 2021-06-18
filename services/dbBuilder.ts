import Dexie from 'dexie';
import { Entry } from '../model/entry';
import { Subscription } from '../model/subscription';

export type DBEntry = Omit<Entry, 'unread'> & {
    unread: number,
};

export class DB extends Dexie {
    entries: Dexie.Table<DBEntry, string>;
    subscriptions: Dexie.Table<Subscription, string>;

    constructor() {
        super('articles');
        this.version(5)
            .stores({
                subscriptions: '&id,title',
                entries: '&id,title,published,origin.streamId,[origin.streamId+unread],[unread+published]',
            });

        this.entries = this.table('entries');
        this.subscriptions = this.table('subscriptions');
    }
}