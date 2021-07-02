import { getDb } from "./db";
import { Entry } from "../model/entry";

let scrollPos = 0;
export const getScrollPos = () => scrollPos;
export const setScrollPos = (newScrollPos: number) => scrollPos = newScrollPos;

export async function entryCount(unreadOnly: boolean, streamId: string) {
    const db = await getDb();

    // No filtering, return total count of entries.
    if (!unreadOnly && !streamId) {
        return db.entries.count();
    }

    const query = {};
    if (unreadOnly)
        query['unread'] = 1;

    if (streamId)
        query['origin.streamId'] = streamId;

    // Otherwise, return the number of entries matching the query.
    return db.entries.where(query).count();
}

export async function* entryIterator(unreadOnly: boolean, streamId?: string, pageSize = 50) {
    let finished = false;
    let lastDate = Date.now();
    const seen = new Set<string>();
    const db = await getDb();

    const { default: Dexie } = await import('dexie');
    const query = (to: typeof db.entries) => {
        if (unreadOnly) {
            return to
                .where('[unread+published]')
                .between(
                    [1, Dexie.minKey],
                    [1, lastDate],
                    true, true)
        }

        return to.orderBy('published');
    }

    while (!finished) {
        const page = await query(db.entries)
            .reverse()
            // Note: And clauses happen in memory.
            // Make sure we don't have this entry already.
            .and(e => !seen.has(e.id))
            .and(e => !streamId || e.origin.streamId === streamId)
            .limit(pageSize)
            .toArray();

        // If there weren't enough items to fill the page,
        // then we're done!
        if (page.length < pageSize) {
            finished = true;
        } else {
            const lastPublished = page[page.length - 1].published;
            lastDate = lastPublished;
        }

        // Yield the items in the page.
        for (const entry of page) {
            // Record that we've seen the entry.
            seen.add(entry.id);

            // We do the weird typecast so unread: number is unread: boolean
            yield entry as unknown as Entry;
        }
    }
}
