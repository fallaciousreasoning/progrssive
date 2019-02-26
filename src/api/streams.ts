import feedlyConfig from '../../feedly.json'
import { feedlyQueryString } from './common.js';
import { Stream } from '../model/stream.js';
const endpoint = '/streams'

interface StreamRequestOptions {
    count?: number;
    ranked?: 'oldest' | 'newest';
    unreadOnly?: boolean;
    newerThan?: number;
    continuation?: string;
}

export const getStream = async (streamId: string, type: 'content' | 'id' = 'content', options?: StreamRequestOptions): Promise<Stream> => {
    return fetch(`${feedlyConfig.feedlyUrl}${endpoint}/${type}?streamId=${streamId}&${feedlyQueryString(options || {})}`)
        .then(r => r.json()) as Promise<Stream>;
}