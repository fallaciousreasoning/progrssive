import { Marker } from "../model/markers";
import { makePostRequest } from "./common";
import { Entry } from "../model/entry";

const endpoint = 'v3/markers';

export const updateMarkers = async (marker: Marker) => {
    await makePostRequest(endpoint, marker);
}

export const updateRead = async (items: (Entry | Entry[]), read: boolean = true) => {
    items = Array.isArray(items) ? items : [items];

    const marker: Marker = {
        type: 'entries',
        action: read ? 'markAsRead' : 'keepUnread',
        entryIds: items.map(i => i.id)
    };
    await updateMarkers(marker);
};

export const updateSaved = async (entry: Entry, saved: boolean = true) => {
    const marker: Marker = {
        type: 'entries',
        action: saved ? 'markAsSaved' : 'markAsUnsaved',
        entryIds: [entry.id]
    };
    await updateMarkers(marker);
}