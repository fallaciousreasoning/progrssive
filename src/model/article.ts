/**
 * See https://developer.feedly.com/v3/entries/ for source.
 */
export interface Article {
    id?: string;
    keywords?: string[];
    originId?: string;
    fingerprint?: string;
    
    thumbnail?: ArticleThumbnail[];
    
    title: string;
    author: string;
    summary: ArticleSummary;
    
    published?: number;
    crawled?: number;
    recrawled?: number;
    updated?: number;


    alternate?: ArticleLink[];
    canonical?: ArticleLink[];

    enclosure?: ArticleLink[];

    origin?: ArticleOrigin;

    visual?: ArticleVisual;

    unread: boolean;

    categories?: ArticleCategory[];
    tags?: ArticleCategory[];

    engagement?: number;
    engagementRate?: number;
}

export interface ArticleThumbnail {
    url: string;
}

export interface ArticleSummary {
    content: string;
    direction?: 'ltr' | 'rtl';
}

export interface ArticleLink {
    href: string;
    type: string;
}

export interface ArticleOrigin {
    streamId: string;
    title: string;
    htmlUrl: string;
}

export interface ArticleVisual {
    url: string;
    width: number;
    height: number;
    contentType: string;
}

export interface ArticleCategory {
    id: string;
    label?: string;
}