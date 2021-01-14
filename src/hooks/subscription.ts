import { Store } from "react-recollect";

export const useIsTransientSubscription = (id: string, store: Store) => {
    // The all feed is never transient.
    if (id === undefined || id === "")
        return false;

    return !store.subscriptions.find(s => s.id === id);
}