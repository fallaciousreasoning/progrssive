import { makeFeedlyRequest } from '@/feedly/common';
import { Stream } from '@/model/stream';
import { NextApiResponse } from 'next';
import { ApiRequest } from 'types/ApiRequest';

const defaultOptions = {}

export default async function (request: ApiRequest<{ streamId: string, count?: number, ranked?: 'oldest' | 'newest', newerThan?: number, continuation?: string }>, response: NextApiResponse) {
    const { streamId, ...options } = request.query;
    const stream = await makeFeedlyRequest<Stream>(`streams/contents?streamId=${encodeURIComponent(request.query.streamId)}`, { ...defaultOptions, ...options })
    response.setHeader('Content-Type', 'application/json')
    response.send(stream);
}
