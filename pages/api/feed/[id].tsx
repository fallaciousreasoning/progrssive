import { makeFeedlyRequest } from '@/feedly/common';
import { Subscription } from '@/model/subscription';
import { ApiRequest } from '@/types/ApiRequest';
import { NextApiResponse } from 'next';

export default async function (request: ApiRequest<{ id: string }>, response: NextApiResponse) {
    const result = await makeFeedlyRequest<Subscription>(`/feeds/${encodeURIComponent(request.query.id)}`)
    response.setHeader('Content-Type', 'application/json');
    response.send(result);
}
