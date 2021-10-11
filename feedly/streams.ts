import { Stream } from '../model/stream';
import { makeFeedlyRequest } from './common';
import { Entry } from '../model/entry';
const endpoint = 'streams'

export interface StreamRequestOptions {
    count?: number;
    ranked?: 'oldest' | 'newest';
    newerThan?: number;
    continuation?: string;
}

const defaultOptions = {
}

export const getStream = async (streamId: string, type: 'contents' | 'id' = 'contents', options?: StreamRequestOptions): Promise<Stream> => {
    return makeFeedlyRequest<Stream>(`${endpoint}/${type}?streamId=${encodeURIComponent(streamId)}`, { ...defaultOptions, ...options });
}

export const getAllEntries = async (streamId: string, since: number, batchSize=100, limit=100) => {
    batchSize = Math.min(batchSize, 1000);
    
    const result: Entry[] = [];
    
    let continuation: string;
    do {
        const options: StreamRequestOptions = {
            count: batchSize
        };

        if (since !== undefined)
            options.newerThan = since;

        if (continuation)
            options.continuation = continuation;

        const stream = await getStream(streamId, 'contents', options);
        for (const entry of stream.items) {
            result.push(entry);
            if (result.length >= limit)
                return result;
        }
        continuation = stream.continuation;
    } while (continuation);

    return result;
}
