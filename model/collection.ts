export interface Feed {
    id: string;
    feedId: string;
    title: string;
    added: number;
    updated: number;
    website: string;
    visualUrl: string;
    velocity: number;
    numReadEntriesPastMonth: number;
    numLongReadEntriesPastMonth: number;
    totalReadingTimePastMonth: number;
    numTaggedEntriesPastMonth: number;

    subscribers: number;
    topics: string[];
    partial: boolean;
    contentType: string;
    language: string;
    description: string;
}

export interface Collection {
    id: string;
    label: string;
    description: string;
    cover: string;
    created: number;
    feeds: Feed[];
    numFeeds: number;
}