import { useSubscription } from "../services/subscriptions";

export const useIsTransientSubscription = (id: string) => {
    const subscription = useSubscription(id);

    // The all feed is never transient.
    if (id === undefined || id === "")
        return false;
    return !subscription;
}