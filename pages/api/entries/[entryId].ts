import { NextApiRequest, NextApiResponse } from 'next'

export default function(request: NextApiRequest, response: NextApiResponse) {
    response.send({ entryId: request.query.entryId });
}