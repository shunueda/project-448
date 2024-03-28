import type { NextApiRequest, NextApiResponse } from 'next'

const storage = new Map<string, string>()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'PUT') {
    const trackId = req.query.trackId as string
    const data = req.body.data as string
    storage.set(trackId, data)
    res.status(200).send('OK')
  }
  if (req.method === 'POST') {
    const trackId = req.query.trackId as string
    const data = storage.get(trackId)!
    res.status(200).send(data)
  }
}
