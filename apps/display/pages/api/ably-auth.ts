import Ably, { TokenRequest } from 'ably'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<TokenRequest>
) {
  const client = new Ably.Realtime(process.env.ABLY_API_KEY)
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: 'ably-nextjs-demo'
  })
  return res.status(200).json(tokenRequestData)
}
