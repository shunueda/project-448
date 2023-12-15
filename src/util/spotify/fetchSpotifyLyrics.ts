import { getSpotifyAccessToken } from './spotifyAccessTokenManager'
import fetchJson from '../fetchJson.ts'
import LyricsData from '../../models/LyricsData.ts'

const cache = new Map<string, LyricsData>()

export default async function fetchLyrics(
	trackId: string
): Promise<LyricsData> {
	if (cache.has(trackId)) {
		return cache.get(trackId)!
	}
	const token = await getSpotifyAccessToken()
	const url = `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&vocalRemoval=false`
	const lyricsData = await fetchJson<LyricsData>(url, {
		headers: {
			'app-platform': 'WebPlayer',
			Authorization: `Bearer ${token}`
		}
	})
	cache.set(trackId, lyricsData)
	return lyricsData
}
