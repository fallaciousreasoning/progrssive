import { db } from "./db";

function getUnreadCount(streamId?: string) {
    const query = { unread: true };
    // If we have a streamId, use it to filter.
    if (streamId) {
        query['streamIds'] = streamId;
    }

    // Return the number of entries matching the query.
    return db.entries
        .where(query)
        .count();
}

async function* entryIterator(streamId?: string, pageSize = 50) {
    let finished = false;
    let lastDate = Date.now();

    while (!finished) {
        const page = await db.entries
            .where('published')
            .below(lastDate)
            // Note: This happens in memory.
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