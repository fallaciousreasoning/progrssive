import { fetchJson } from 'utils/fetch';
import { Subscription } from '../model/subscription';
import querystring from 'querystring'

export interface SearchRequestOptions {
    count?: number;
    locale?: string;
}

export const searchFeeds = async (query: string, options?: SearchRequestOptions): Promise<Subscription[]> => {
    return await fetchJson(`/api/search/${encodeURIComponent(query)}?${querystring.stringify(options)}`)
}

export const getFeed = async (id: string): Promise<Subscription> => {
    return await fetchJson(`/api/feed/${encodeURIComponent(id)}`);
}
