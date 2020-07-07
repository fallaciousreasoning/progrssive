import { Link } from "./link";

/**
 * See https://developer.feedly.com/v3/entries/ for source.
 */
export interface Entry {
    id?: string;
    keywords?: string[];
    originId?: string;
    fingerprint?: string;
    
    thumbnail?: EntryThumbnail[];
    
    title: string;
    author: string;
    summary?: EntryContent;
    content?: EntryContent;
    mobilized?: EntryContent;

    commonTopics?: any[];
    entities?: any[];
    webfeeds?: any;
    memes?: any[];
    
    published?: number;
    crawled?: number;
    recrawled?: number;
    updated?: number;
    readTime?: number;

    updateCount?: number;

    alternate?: Link[];
    canonicalUrl?: string;
    canonical?: Link[];

    enclosure?: Link[];

    origin?: EntryOrigin;

    visual?: EntryVisual;

    unread: boolean;

    categories?: EntryCategory[];
    tags?: EntryCategory[];

    engagement?: number;
    engagementRate?: number;
}

export interface EntryThumbnail {
    url: string;
}

export interface EntryContent {
    content: string;
    direction?: 'ltr' | 'rtl';
}

export interface EntryOrigin {
    streamId: string;
    title: string;
    htmlUrl: string;
}

export interface EntryVisual {
    url: string;
    width: number;
    height: number;
    contentType: string;
    edgeCacheUrl?: string;
    processor?: string;
    expirationDate?: number;
}

export interface EntryCategory {
    id: string;
    label?: string;
}