import { Entry } from "../model/entry";
import relativeDate from 'tiny-relative-date';

export const sanitizeContent = (contentString: string) => {
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
    const detail = entry.content || entry.summary;
    return sanitizeContent(detail && detail.content);
}

export const getEntrySummary = (entry: Entry) => sanitizeContent(entry.summary && entry.summary.content);

export const getEntryByline = (entry: Entry) => `${entry.engagement ? entry.engagement + ' ' : ''}${entry.origin && entry.origin.title} / ${relativeDate(new Date(entry.published))}`;

export const getEntryVisualUrl = (entry: Entry) => {
    let url = entry.visual && entry.visual.url;

    // Attempt to stop the mixed content warnings!
    // If the site doesn't have an https version of the image, we just won't display one.
    if (url)
        url = url.replace("$http:", "https:");
    return url;
}

export const isSaved = (entry: Entry) => entry.tags && entry.tags.some(e => e.id.endsWith('global.saved'));