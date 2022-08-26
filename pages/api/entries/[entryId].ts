import { makeFeedlyRequest } from '@/feedly/common';
import { Entry } from '@/model/entry';
import { ApiRequest } from '@/types/ApiRequest';
import { NextApiResponse } from 'next';

export default async function (request: ApiRequest<{ entryId }>, response: NextApiResponse) {
    const entries = await makeFeedlyRequest<Entry[]>(`entries/${encodeURIComponent(request.query.entryId)}`);
    response.setHeader('Content-Type', 'application/json');
    response.send(entries[0]);
}
