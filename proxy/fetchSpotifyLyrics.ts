import { getSpotifyAccessToken } from './spotifyAccessTokenManager'
import fetchJson from './util/fetchJson'
import type LyricsData from '../src/models/LyricsData'

export default async function fetchLyrics(
	trackId: string
): Promise<LyricsData> {
	const token = await getSpotifyAccessToken()
	const url = `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&vocalRemoval=false`
	return fetchJson<LyricsData>(url, {
		headers: {
			'app-platform': 'WebPlayer',
			Authorization: `Bearer ${token}`
		}
	})
}
