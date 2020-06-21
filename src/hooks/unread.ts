import { useEffect, useState } from "react";
import { DBEntry, removeEntryListener, addEntryListener } from "../services/db";
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

            const diff = newEntry.unread - oldEntry.unread;
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