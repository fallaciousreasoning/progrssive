import { Stream } from '../model/stream';
import { makeRequest } from './common';
const endpoint = '/streams'

interface StreamRequestOptions {
    count?: number;
    ranked?: 'oldest' | 'newest';
    unreadOnly?: boolean;
    newerThan?: number;
    continuation?: string;
}

const defaultOptions = {
    unreadOnly: true,
}

export const getStream = async (streamId: string, type: 'contents' | 'id' = 'contents', options?: StreamRequestOptions): Promise<Stream> => {
    return makeRequest<Stream>(`${endpoint}/${type}?streamId=${streamId}`, { ...defaultOptions, ...options });
}

export const getAllStreams = async (userId: string, unreadOnly: boolean = true): Promise<Stream> => {
    return getStream(getAllId(userId), 'contents', { unreadOnly });
}

export const getAllId = (userId: string) => `user/${userId}/category/global.all`;

export const getUncategorizedId = (userId: string) => {
    return `user/${userId}/category/global.uncategorized`;
}