import { getSpotifyAccessToken } from 'lib/auth/accessTokenManager'
import type LyricsData from './models/LyricsData'

export default async function fetchLyrics(
  trackId: string
): Promise<LyricsData> {
  const access_token = getSpotifyAccessToken()
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
  return json
}
