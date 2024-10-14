import { delay } from "./promise";

const toWrap = ['back', 'forward', 'go', 'pushState', 'replaceState'] as const
if (globalThis.history) {
    const oldHistory = { ...globalThis.history }
    for (const key of toWrap) {
        globalThis.history[key] = (...args) => {
            document.startViewTransition(async () => {
                oldHistory[key].apply(globalThis.history, args)
                await delay(100);
            })
        }
    }
}
