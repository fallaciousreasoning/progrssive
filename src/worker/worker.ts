export const runEntryCleanup = async () => {
    const start = performance.now();

    console.log("Beginning cleanup...");

    const { getDb } = await import("../services/db");
    const db = await getDb();

    const entries = await db.entries.toArray();
    console.log(`Have ${entries.length} entries!`);
    const end = performance.now();
    console.log(`Took ${(end - start)}ms to load entries`);
}