import type LyricsData from '../models/LyricsData'
import { getSpotifyAccessToken } from './auth/accessTokenManager'

export default async function fetchLyrics(
  trackId: string
): Promise<LyricsData | undefined> {
  try {
    const token = await getSpotifyAccessToken()
    const url = `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&vocalRemoval=false`
    const res = await fetch(url, {
      headers: {
        'app-platform': 'WebPlayer',
        Authorization: `Bearer ${token}`
      }
    })
    const json = await res.json() as LyricsData
    json.lyrics.lines.forEach(line => {
      line.startTimeMs = parseInt(line.startTimeMs.toString())
      line.endTimeMs = parseInt(line.endTimeMs.toString())
    })
    return json
  } catch (e) {
    return undefined
  }
}