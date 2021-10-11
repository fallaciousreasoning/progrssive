import Dexie from 'dexie';
import { Settings } from '../model/settings';
import { Entry } from '../model/entry';
import { Subscription } from '../model/subscription';

export type DBEntry = Omit<Entry, 'unread'> & {
    unread: number,
};

export class DB extends Dexie {
    entries: Dexie.Table<DBEntry, string>;
    subscriptions: Dexie.Table<Subscription, string>;
    settings: Dexie.Table<Settings, string>;

    constructor() {
        super('articles');
        this.version(6)
            .stores({
                subscriptions: '&id,title',
                entries: '&id,title,published,origin.streamId,[origin.streamId+unread],[unread+published]',
                settings: '&id'
            });

        this.entries = this.table('entries');
        this.subscriptions = this.table('subscriptions');
        this.settings = this.table('settings');
    }
}