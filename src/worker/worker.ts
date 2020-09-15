import { Entry } from "../model/entry";
import { CleanupSettings } from "../types/RecollectStore";
import { round } from "../utils/math";
import { day } from "../utils/time";

const shouldDelete = (now: number, settings: CleanupSettings, entry: Entry) => {
    const timeSinceRead = now - entry.readTime;
    const timeSincePublished = now - entry.published;

    // Handle unread articles
    if (!entry.readTime || entry.unread) {
        const cleanAfter = settings.deleteUnreadEntries;
        if (cleanAfter === "never") return false;

        // if it's been more than cleanAfter days, delete the article.
        return timeSincePublished > cleanAfter * day;
    }

    const cleanAfter = settings.deleteReadEntries;
    if (cleanAfter === "never") return false;
    // Entries older than cleanAfter days should be deleted.
    return timeSinceRead > cleanAfter * day;
}

export const runEntryCleanup = async (cleanupSettings: CleanupSettings) => {
    const start = performance.now();

    console.log("Beginning cleanup...");

    const { getDb } = await import("../services/db");
    const db = await getDb();

    const entries = await db.entries.toArray();
    console.log(`Have ${entries.length} entries!`);

    const now = Date.now();
    const oldEntries = entries.filter(e => shouldDelete(now, cleanupSettings, e as any));
    console.log(`Found ${oldEntries.length} entries to delete`);

    const deleteIds = oldEntries.map(e => e.id);
    // Uncomment this to actually delete entries.
    await db.entries.bulkDelete(deleteIds);

    const end = performance.now();
    console.log(`Took ${round(end - start)}ms to cleanup entries`);
}