import { Entry } from "../model/entry";
import relativeDate from 'tiny-relative-date';
import { getSavedId } from "../api/streams";

export const getEntryContent = (entry: Entry) => {
    const detail = entry.content || entry.summary;
    return detail && detail.content;
}

export const getEntrySummary = (entry: Entry) => entry.summary && entry.summary.content;

export const getEntryByline = (entry: Entry) => `${entry.engagement ? entry.engagement + ' ' : ''}${entry.origin && entry.origin.title} / ${relativeDate(new Date(entry.published))}`;

export const getEntryVisualUrl = (entry: Entry) => entry.visual && entry.visual.url;

export const setSaved = (entry: Entry, saved: boolean, profileId: string) => {
    const tagId = getSavedId(profileId);
    if (!saved) {
        entry.tags = entry.tags.filter(e => e.id !== tagId);
    } else {
        entry.tags = [...entry.tags, {
            id: tagId,
            label: 'Saved For Later'
        }];
    }
}
export const isSaved = (entry: Entry) => entry.tags && entry.tags.some(e => e.id.endsWith('global.saved'));