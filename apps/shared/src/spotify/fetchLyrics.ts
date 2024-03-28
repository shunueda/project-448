import type LyricsData from '../LyricsData'
import { getSpotifyAccessToken } from './auth/accessTokenManager'

export async function fetchLyrics(trackId: string): Promise<LyricsData> {
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
  return json
}
