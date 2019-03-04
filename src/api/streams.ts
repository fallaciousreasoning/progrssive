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

export const getAllStream = async (userId: string, unreadOnly: boolean = true): Promise<Stream> => {
    return getStream(`user/${userId}/category/global.all`, 'contents', { unreadOnly });
}