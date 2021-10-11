import { Subscription } from '../model/subscription';
import { makeFeedlyRequest } from './common';
const endpoint = '/search/feeds'

export interface SearchRequestOptions {
    count?: number;
    locale?: string;
}

export const searchFeeds = async (query: string, options?: SearchRequestOptions): Promise<Subscription[]> => {
    const result = await makeFeedlyRequest<{ results: Subscription[] }>(`${endpoint}?query=${encodeURIComponent(query)}`, options);
    return result.results;
}

export const getFeed = async (id: string): Promise<Subscription> => {
    const result = await makeFeedlyRequest<Subscription>(`/feeds/${encodeURIComponent(id)}`);
    return result;
}