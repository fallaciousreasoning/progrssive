import { Entry } from "../model/entry";
import { round } from "../utils/math";
import { week } from "../utils/time";

const shouldDelete = (now: number, entry: Entry) => {
    // Don't delete unread articles.
    if (!entry.readTime || entry.unread)
        return false;

    const timeSinceRead = now - entry.readTime;

    // Entries older than one week should be deleted.
    return timeSinceRead > week;
}
 
export const runEntryCleanup = async () => {
    const start = performance.now();

    console.log("Beginning cleanup...");

    const { getDb } = await import("../services/db");
    const db = await getDb();

    const entries = await db.entries.toArray();
    console.log(`Have ${entries.length} entries!`);

    const now = Date.now();
    const oldEntries = entries.filter(e => shouldDelete(now, e as any));
    console.log(`Found ${oldEntries.length} entries to delete`);

    const deleteIds = oldEntries.map(e => e.id);
    // Uncomment this to actually delete entries.
    // await db.entries.bulkDelete(deleteIds);

    const end = performance.now();
    console.log(`Took ${round(end - start)}ms to cleanup entries`);
}