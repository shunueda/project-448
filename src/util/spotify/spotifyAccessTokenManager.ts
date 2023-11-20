import fetchJson from '../fetchJson.ts'
import SpotifyAuth from '../../models/SpotifyAuthCache.ts'

const cacheKey = 'spotify_cache'
const cacheExpirationBuffer = 1000 * 60 * 5 // 5 min

export function isCachedSpotifyTokenExpired(): boolean {
	if (localStorage.getItem(cacheKey) == null) {
		return true
	}
	const cache = JSON.parse(localStorage.getItem(cacheKey)!)
	return (
		cache.accessTokenExpirationTimestampMs < Date.now() + cacheExpirationBuffer
	)
}

export async function refreshSpotifyAccessToken(): Promise<string> {
	console.log('Refreshing Spotify access token')
	const auth = await fetchJson<SpotifyAuth>('/get_spotify_access_token')
	if (auth.isAnonymous) {
		throw new Error('Failed to refresh Spotify access token - SP_DC is invalid')
	}
	localStorage.setItem(cacheKey, JSON.stringify(auth))
	return auth.accessToken
}

export async function getSpotifyAccessToken(): Promise<string> {
	if (isCachedSpotifyTokenExpired()) {
		return refreshSpotifyAccessToken()
	}
	return JSON.parse(localStorage.getItem(cacheKey)!).accessToken
}
