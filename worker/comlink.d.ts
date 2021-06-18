declare module 'comlink-loader!*' {
    class CustomWorker extends Worker {
        constructor();

        runEntryCleanup(settings: import('../types/RecollectStore').CleanupSettings): Promise<void>;
    }

    export = CustomWorker;
}