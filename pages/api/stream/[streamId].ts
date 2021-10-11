import { NextApiRequest, NextApiResponse } from 'next'

export default function(request: NextApiRequest, response: NextApiResponse) {
    response.status(200);
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ streamId: request.query.streamId }));
}