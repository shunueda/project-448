import type { NextApiRequest, NextApiResponse } from 'next'
import { spotifyClient } from '../../lib/spotifyClient'

const cache = new Map<string, string>()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    url: string
  }>
) {
  try {
    const trackId = req.query.trackId as string
    if (cache.has(trackId)) {
      res.json({
        url: cache.get(trackId)!
      })
      return
    }
    const track = await spotifyClient.tracks.get(trackId)
    const url = track.album.images[0].url
    cache.set(trackId, url)
    res.json({
      url
    })
  } catch (e) {
    res.status(500).send({
      url: ''
    })
  }
}
