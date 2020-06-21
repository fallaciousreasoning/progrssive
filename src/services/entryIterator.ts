import { db } from "./db";

export async function entryCount(unreadOnly: boolean, streamId: string) {
    // No filtering, return total count of entries.
    if (!unreadOnly && !!streamId)
        return db.entries.where('published').above(0).count();

    const query = { };
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

    while (!finished) {
        const page = await db.entries
            .where('published')
            .below(lastDate)
            // Note: An clauses happen in memory.
            .and(e => !unreadOnly || e.unread)
            .and(e => !!streamId || e.streamIds.includes(streamId))
            .limit(pageSize)
            .toArray();

        const lastPublished = page[page.length - 1].published;
        lastDate = lastPublished;

        // If there weren't enough items to fill the page,
        // then we're done!
        if (page.length < pageSize) {
            finished = true;
        }

        // Yield the items in the page.
        yield* page;
    }
}