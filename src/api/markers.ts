import { Marker } from "../model/markers";
import { makePostRequest } from "./common";
import { Entry } from "../model/entry";
import { get, save } from "../services/persister";

const endpoint = '/markers';

export const updateMarkers = async (marker: Marker) => {
    try {
        await makePostRequest(endpoint, marker);
    } catch (error) {
        await hitMarkerWhenOnline(marker);
    }
}

export const updateUnread = async (items: (Entry | Entry[]), unread: boolean = true) => {
    items = Array.isArray(items) ? items : [items];

    const marker: Marker = {
        type: 'entries',
        action: unread ? 'keepUnread' : 'markAsRead',
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


const markerKeysName = 'markers-for-online';
let markersForOnline: Marker[];

const saveMarkersForOnline = async () => {
    await save(markerKeysName, markersForOnline);
}

export const hitMarkerWhenOnline = async (marker: Marker) => {
    if (!markersForOnline)
        markersForOnline = await getMarkersForOnline();

    markersForOnline.push(marker);
    await saveMarkersForOnline();
}

export const getMarkersForOnline = async () => {
    return await get(markerKeysName) as any || [];
}

(async () => {
    const updateMarkersForOnline =  async () => {
        const promises = markersForOnline.map(updateMarkers);
        markersForOnline.length = 0;
        await saveMarkersForOnline();
        await Promise.all(promises);
    };

    markersForOnline = await getMarkersForOnline();
    if (navigator.onLine)
      await updateMarkersForOnline();

    window.addEventListener('online', updateMarkersForOnline);
})();