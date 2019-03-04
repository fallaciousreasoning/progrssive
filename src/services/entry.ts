import { Entry } from "../model/entry";

export const getEntryContent = (entry: Entry) => {
    const detail = entry.content || entry.summary;
    return detail && detail.content;
}

export const getEntryByline = (entry: Entry) => `${entry.engagement} ${entry.origin && entry.origin.title} / ${(entry.published)}`;

export const getEntryVisualUrl = (entry: Entry) => entry.visual && entry.visual.url;