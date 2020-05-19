import { Entry } from "../model/entry";
import relativeDate from 'tiny-relative-date';

export const getEntryContent = (entry: Entry) => {
    const detail = entry.content || entry.summary;
    return detail && detail.content;
}

export const getEntrySummary = (entry: Entry) => entry.summary && entry.summary.content;

export const getEntryByline = (entry: Entry) => `${entry.engagement ? entry.engagement + ' ' : ''}${entry.origin && entry.origin.title} / ${relativeDate(new Date(entry.published))}`;

export const getEntryVisualUrl = (entry: Entry) => entry.visual && entry.visual.url;

export const isSaved = (entry: Entry) => entry.tags && entry.tags.some(e => e.id.endsWith('global.saved'));