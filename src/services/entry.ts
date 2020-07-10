import { Entry } from "../model/entry";
import relativeDate from 'tiny-relative-date';
import { getStore } from "../hooks/store";

const sanitizeContent = (contentString: string) => {
    if (!contentString)
        return contentString;


    // Remove tracking pixels.
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${contentString}</div>`, "text/html");
    // Remove tracking pixels.
    doc.querySelectorAll("img[width='1']").forEach(i => i.remove());
    contentString = doc.body.innerHTML;
    return contentString;
}
export const getEntryContent = (entry: Entry) => {
    if (!entry)
        return '';
    const detail = entry.content || entry.summary;
    return sanitizeContent(detail && detail.content);
}

export const getEntryUrl = (entry: Entry) => {
    if (!entry)
        return '';

    if (entry.canonicalUrl)
        return entry.canonicalUrl;

    if (entry.canonical && entry.canonical.length)
        return entry.canonical[0].href;

    if (entry.originId && entry.originId.startsWith('http'))
        return entry.originId;
}

export const getEntrySummary = (entry: Entry) => entry && sanitizeContent(entry.summary && entry.summary.content);

export const getEntryByline = (entry: Entry) => entry && `${entry.engagement ? entry.engagement + ' ' : ''}${entry.origin && entry.origin.title} / ${relativeDate(new Date(entry.published))}`;

export const getEntryVisualUrl = (entry: Entry) => {
    if (!entry)
        return;

    let url = entry.visual && entry.visual.url;
    if (url === "none")
        return null;

    // Attempt to stop the mixed content warnings!
    // If the site doesn't have an https version of the image, we just won't display one.
    if (url)
        url = url.replace("$http:", "https:");
    return url;
}

export const getEntrySubscription = (entry: Entry) => {
    if (!entry)
        return;
    const streamId = entry.origin && entry.origin.streamId;
    const subscriptions = getStore().subscriptions;
    return subscriptions.find(s => s.id === streamId);
}

export const getEntryPreferredView = (entry: Entry) => {
    if (!entry)
        return 'feedly';

    const subscription = getEntrySubscription(entry);
    return subscription
        ? subscription.preferredView
        : 'feedly';
}