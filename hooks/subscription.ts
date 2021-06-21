import { getSubscription } from "../services/subscriptions";

export const useIsTransientSubscription = (id: string) => {
    // The all feed is never transient.
    if (id === undefined || id === "")
        return false;

    return !getSubscription(id);
}