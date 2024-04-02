import { Track } from '@spotify/web-api-ts-sdk'
import { spotifyClient } from 'shared'

const cache = new Map<string, Track>()

export default async function getTrack(trackId: string) {
  if (cache.has(trackId)) {
    return cache.get(trackId)!
  }
  const track = (await spotifyClient.tracks.get(trackId))!
  cache.set(trackId, track)
  return track
}
