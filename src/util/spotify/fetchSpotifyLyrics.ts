import { getSpotifyAccessToken } from './spotifyAccessTokenManager'
import fetchJson from '../fetchJson.ts'
import LyricsData from '../../models/LyricsData.ts'

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
