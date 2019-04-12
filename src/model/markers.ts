interface MarkerBase {
    action: 'markAsRead' | 'keepUnread' | 'markAsSaved' | 'markAsUnsaved';
    asOf?: Date;
}

interface EntryMarker {
    type: 'entries';
    entryIds: string[];
}

interface FeedMarker {
    type: 'feeds';
    feedIds: string[];
}

interface CategoryMarker {
    type: 'categories';
    categoryIds: string[];
}

interface TagMarker {
    type: 'tags';
    tagIds: string[];
}

export type Marker = MarkerBase & (
    EntryMarker
    | FeedMarker
    | CategoryMarker
    | TagMarker
);