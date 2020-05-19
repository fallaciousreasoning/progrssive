import { Stream } from '../model/stream';
import { makeRequest } from './common';
const endpoint = '/streams'

export interface StreamRequestOptions {
    count?: number;
    ranked?: 'oldest' | 'newest';
    newerThan?: number;
    continuation?: string;
}

const defaultOptions = {
}

export const getStream = async (streamId: string, type: 'contents' | 'id' = 'contents', options?: StreamRequestOptions): Promise<Stream> => {
    return makeRequest<Stream>(`${endpoint}/${type}?streamId=${streamId}`, { ...defaultOptions, ...options });
}