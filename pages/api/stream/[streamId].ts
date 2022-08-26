import { getStream } from '@/feedly/streams';
import { NextApiResponse } from 'next';
import { ApiRequest } from 'types/ApiRequest';

export default async function(request: ApiRequest<{ streamId: string }>, response: NextApiResponse) {
    const stream = await getStream(request.query.streamId)
    response.setHeader('Content-Type', 'application/json')
    response.send(stream);
}
