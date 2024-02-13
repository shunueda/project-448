import { existsSync, readFileSync, writeFileSync } from 'fs'
import fetch from 'node-fetch'
import SpdcAuthResponse from './SpotifyAuth'
import { AccessToken } from '@spotify/web-api-ts-sdk'

const CACHE_FILENAME = '.spotify_access_token_cache'

function readCacheFile(): AccessToken {
  return JSON.parse(readFileSync(CACHE_FILENAME, 'utf-8'))
}

export function isCachedSpotifyTokenExpired(): boolean {
  if (!existsSync(CACHE_FILENAME)) {
    return true
  }
  const cache = readCacheFile()
  return (
    cache.expires_in < (Date.now() / 1000)
  )
}

export async function refreshSpotifyAccessToken(): Promise<AccessToken> {
  const res = await fetch(
    'https://open.spotify.com/get_access_token',
    {
      headers: {
        Cookie: `sp_dc=AQBmcIrSJ5_jwpo6-BFaXuBgg8HUcKjxk18oT86fTY7oUJS_8aqeG8hZcfLQiwI7tgmh8tgQs7DTwHI-p31N7H1xqkpUNqzF2zuKc5b9DarhOmEPD70-ENV61aQJqU9wBmJmen5kj8NV-hpnoy-_UfeE7LSGM12g`
      }
    }
  )
  const auth = await res.json() as SpdcAuthResponse
  if (auth.isAnonymous) {
    throw new Error('Failed to refresh Spotify access token - SP_DC is invalid')
  }
  const accessToken = {
    access_token: auth.accessToken,
    token_type: 'Bearer',
    expires_in: auth.accessTokenExpirationTimestampMs / 1000,
    refresh_token: ''
  } satisfies AccessToken
  writeFileSync(CACHE_FILENAME, JSON.stringify(accessToken))
  return accessToken
}

export async function getSpotifyAccessToken(): Promise<AccessToken> {
  if (isCachedSpotifyTokenExpired()) {
    return refreshSpotifyAccessToken()
  }
  return readCacheFile()
}