import Ably, { TokenRequest } from 'ably'
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenRequest>
) {
  await NextCors(req, res, {
    methods: ['GET'],
    origin: '*'
  })
  const client = new Ably.Realtime(process.env.ABLY_API_KEY)
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: 'ably-nextjs-demo'
  })
  return res.status(200).json(tokenRequestData)
}
