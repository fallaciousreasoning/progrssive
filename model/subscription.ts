import { Category } from "./category";

export interface Subscription {
    id: string;
    title: string;
    categories: Category[];
    added?: number;
    updated?: number;
    lastSync?: number;
    website?: string;
    feedUrl?: string;
    visualUrl?: string;
    iconUrl?: string;
    preferredView?: 'feedly' | 'browser' | 'mozilla';

    // Import is considered successful when there is no
    // import status.
    importStatus?: 'pending' | 'failed';
    deleting?: boolean;
}

export const feedUrlPrefix = "feed/";
export const guessFeedUrl = (subscription: Subscription) => {
    if (subscription.feedUrl)
        return subscription.feedUrl;

    if (subscription.id.startsWith(feedUrlPrefix)) {
        return subscription.id.substr(feedUrlPrefix.length);
    }

    // This is probably not right, but it's better than nothing.
    return subscription.id;
}