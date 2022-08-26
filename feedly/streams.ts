import { Stream } from '../model/stream';
import { Entry } from '../model/entry';
import { fetchJson } from 'utils/fetch';
import querystring from 'querystring'

export interface StreamRequestOptions {
    count?: number;
    ranked?: 'oldest' | 'newest';
    newerThan?: number;
    continuation?: string;
}

export const getStream = async (streamId: string, options?: StreamRequestOptions): Promise<Stream> => {
    return await fetchJson(`/api/streams/${encodeURIComponent(streamId)}?${querystring.stringify(options ?? {})}`)
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

        const stream = await getStream(streamId, options);
        for (const entry of stream.items) {
            result.push(entry);
            if (result.length >= limit)
                return result;
        }
        continuation = stream.continuation;
    } while (continuation);

    return result;
}
