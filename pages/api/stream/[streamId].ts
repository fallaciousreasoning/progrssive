import { NextApiRequest, NextApiResponse } from 'next'

export default function(request: NextApiRequest, response: NextApiResponse) {
    response.send({ streamId: request.query.streamId });
}