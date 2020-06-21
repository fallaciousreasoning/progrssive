import { useEffect, useState } from "react";
import { Entry } from "../model/entry";
import { addEntryListener, DBEntry, removeEntryListener } from "../services/db";
import { entryCount } from "../services/entryIterator";

export const useUnreadCount = (streamId?: string) => {
    const [unread, setUnread] = useState(0);

    // Get the initial unread count.
    useEffect(() => {
        entryCount(true, streamId)
            .then(setUnread);
    }, [streamId]);

    // Maintain it.
    useEffect(() => {
        const listener = (oldEntry: DBEntry,
            newEntry: DBEntry) => {
            // We only care about the update if it affects our stream.
            if (streamId && !newEntry.streamIds.includes(streamId)) {
                return;
            }

            let diff = 0;
            if (newEntry)
                diff += newEntry.unread;

            if (oldEntry)
                diff -= oldEntry.unread;

            if (diff === 0)
                return;

            setUnread(unread + diff);
        }
        addEntryListener(listener);
        return () => {
            removeEntryListener(listener);
        }
    }, [unread, streamId]);

    return unread;
}

export const useUnread = (entry: Entry) => {
    const [unread, setUnread] = useState(entry.unread);

    useEffect(() => {
        const listener = (_: DBEntry, newEntry: DBEntry) => {
            if (newEntry.id !== entry.id)
                return;

            setUnread(!!newEntry.unread);
        }

        addEntryListener(listener);
        return () => removeEntryListener(listener);
    }, [entry.id]);

    return unread;
}