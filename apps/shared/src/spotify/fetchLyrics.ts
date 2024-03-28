import type { LyricsData } from 'models'
import { getSpotifyAccessToken } from './auth/accessTokenManager'

const cache = new Map<string, LyricsData>()

export async function fetchLyrics(trackId: string): Promise<LyricsData> {
  if (cache.has(trackId)) {
    return cache.get(trackId)!
  }
  const { access_token } = await getSpotifyAccessToken()
  const url = `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&vocalRemoval=false`
  const response = await fetch(url, {
    headers: {
      'app-platform': 'WebPlayer',
      Authorization: `Bearer ${access_token}`
    }
  })
  const json: LyricsData = await response.json()
  json.lyrics.lines.forEach(line => {
    line.startTimeMs = parseInt(line.startTimeMs.toString())
    line.endTimeMs = parseInt(line.endTimeMs.toString())
  })
  cache.set(trackId, json)
  return json
}
