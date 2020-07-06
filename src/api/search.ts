import { Subscription } from '../model/subscription';
import { makeRequest } from './common';
const endpoint = '/search/feeds'

export interface SearchRequestOptions {
    count?: number;
    locale?: string;
}

export const searchFeeds = async (query: string, options?: SearchRequestOptions): Promise<Subscription[]> => {
    const result = await makeRequest<{ results: Subscription[] }>(`${endpoint}?query=${encodeURIComponent(query)}`, options);
    return result.results;
}