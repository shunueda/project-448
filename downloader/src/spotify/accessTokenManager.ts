import { existsSync, readFileSync, writeFileSync } from 'fs'
import fetch from 'node-fetch'
import type SpotifyAuth from 'shared/models/SpotifyAuth'

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
  const res = await fetch(
    'https://open.spotify.com/get_access_token',
    {
      headers: {
        Cookie: `sp_dc=${process.env.SPOTIFY_SP_DC}`
      }
    }
  )
  const auth = await res.json() as SpotifyAuth
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