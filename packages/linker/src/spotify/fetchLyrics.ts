import { Endpoint } from 'common'
import { type LyricsData, lyricsDataSchema } from './LyricsData'
import { getSpotifyAccessToken } from './auth/getSpotifyAccessToken'

export async function fetchLyrics(
  trackId: string
): Promise<LyricsData | undefined> {
  try {
    const { access_token } = await getSpotifyAccessToken()
    const url = new URL(
      `${Endpoint.SPOTIFY_LYRICS}/${trackId}?format=json&vocalRemoval=false`
    )
    const response = await fetch(url, {
      headers: {
        'app-platform': 'WebPlayer',
        Authorization: `Bearer ${access_token}`
      }
    })
    const json = await response.json()
    return lyricsDataSchema.parse(json)
  } catch (_) {
    return
  }
}
