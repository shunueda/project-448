import { Track } from '@spotify/web-api-ts-sdk'
import { spotifyClientWithAccessToken } from 'shared'

const cache = new Map<string, Track>()

export default async function getTrack(trackId: string) {
  if (cache.has(trackId)) {
    return cache.get(trackId)
  }
  return await spotifyClientWithAccessToken.tracks.get(trackId)
}
