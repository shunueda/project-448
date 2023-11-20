import { existsSync, readFileSync, writeFileSync } from 'fs'
import fetchJson from './util/fetchJson'
import type SpotifyAuth from '../src/models/SpotifyAuthCache'

const cacheFile = '.spotify_cache'
const cacheExpirationBuffer = 1000 * 60 * 5 // 5 min

export function isCachedSpotifyTokenExpired(): boolean {
	if (!existsSync(cacheFile)) {
		return true
	}
	const cache = JSON.parse(readFileSync(cacheFile, 'utf-8'))
	return (
		cache.accessTokenExpirationTimestampMs < Date.now() + cacheExpirationBuffer
	)
}

export async function refreshSpotifyAccessToken(): Promise<string> {
	const auth = await fetchJson<SpotifyAuth>(
		'https://open.spotify.com/get_access_token',
		{
			headers: {
				Cookie: `sp_dc=${process.env.SPOTIFY_SP_DC}`
			}
		}
	)
	if (auth.isAnonymous) {
		throw new Error('Failed to refresh Spotify access token - SP_DC is invalid')
	}
	writeFileSync(cacheFile, JSON.stringify(auth))
	return auth.accessToken
}

export async function getSpotifyAccessToken(): Promise<string> {
	if (isCachedSpotifyTokenExpired()) {
		return refreshSpotifyAccessToken()
	}
	return JSON.parse(readFileSync(cacheFile, 'utf-8')).accessToken
}
