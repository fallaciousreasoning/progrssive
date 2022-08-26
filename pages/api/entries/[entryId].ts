import { getEntry } from '@/feedly/entry';
import { ApiRequest } from '@/types/ApiRequest';
import { NextApiResponse } from 'next';

export default async function(request: ApiRequest<{ entryId }>, response: NextApiResponse) {
    const entry = await getEntry(request.query.entryId);
    response.setHeader('Content-Type', 'application/json');
    response.send(entry);
}
