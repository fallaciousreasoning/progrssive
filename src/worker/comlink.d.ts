declare module 'comlink-loader!*' {
    class CustomWorker extends Worker {
        constructor();

        runEntryCleanup(): Promise<void>;
    }

    export = CustomWorker;
}