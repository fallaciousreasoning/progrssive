import { Stream } from '../model/stream';
import { makeRequest } from './common';
import { Subscription } from '../model/subscription';
const endpoint = '/search/feeds'

export interface SearchRequestOptions {
    count?: number;
    locale?: string;
}

export const searchFeeds = async (query: string, options?: SearchRequestOptions): Promise<Subscription[]> => {
    const result = await makeRequest<{ results: Subscription[] }>(`${endpoint}?query=${query}`, options);
    return result.results;
}