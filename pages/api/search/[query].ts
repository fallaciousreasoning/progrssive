import { makeFeedlyRequest } from '@/feedly/common';
import { Subscription } from '@/model/subscription';
import { ApiRequest } from '@/types/ApiRequest';
import { NextApiResponse } from 'next';

export default async function (request: ApiRequest<{ query: string }>, response: NextApiResponse) {
    const { query, ...options } = request.query;
    const result = await makeFeedlyRequest<{ results: Subscription[] }>(`/search/feeds?query=${encodeURIComponent(query)}`, options);
    response.setHeader('Content-Type', 'application/json');
    response.send(result.results);
}
