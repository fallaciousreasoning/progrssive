import { wrap } from "comlink";
import { CleanupWorker } from "./cleanup";

export const cleanupWorker = () => {
    const worker = new Worker(new URL('./cleanup.ts', import.meta.url), { type: 'module' });
    return wrap<CleanupWorker>(worker);
}