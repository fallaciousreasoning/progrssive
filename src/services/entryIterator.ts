import { getDb } from "./db";
import { Entry } from "../model/entry";

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
        query['streamIds'] = streamId;

    // Otherwise, return the number of entries matching the query.
    return db.entries.where(query).count();
}

export async function* entryIterator(unreadOnly: boolean, streamId?: string, pageSize = 50) {
    let finished = false;
    let lastDate = Date.now();
    const seen = new Set<string>();
    const db = await getDb();

    while (!finished) {
        const page = await db.entries
            .where('published')
            .belowOrEqual(lastDate)
            .reverse()
            // Note: And clauses happen in memory.
            .and(e => !unreadOnly || !!e.unread)
            // Make sure we don't have this entry already.
            .and(e => !seen.has(e.id))
            .and(e => !streamId || e.streamIds.includes(streamId))
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
