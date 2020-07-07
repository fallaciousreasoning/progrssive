import { useStore } from "./store"

export const useIsTransientSubscription = (id: string) => {
    const store = useStore();

    // The all feed is never transient.
    if (id === undefined || id === "")
        return false;

    return !store.subscriptions.find(s => s.id === id);
}