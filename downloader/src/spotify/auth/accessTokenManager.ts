import type { AccessToken } from '@spotify/web-api-ts-sdk'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import type SpdcAuthResponse from './SpdcAuthResponse'

const CACHE_FILENAME = '.spotify_access_token_cache'

function readCacheFile(): AccessToken {
  return JSON.parse(readFileSync(CACHE_FILENAME, 'utf-8'))
}

export function isCachedSpotifyTokenExpired(): boolean {
  return (
    existsSync(CACHE_FILENAME) && readCacheFile().expires_in < Date.now() / 1000
  )
}

export async function refreshSpotifyAccessToken(): Promise<AccessToken> {
  const res = await fetch('https://open.spotify.com/get_access_token', {
    headers: {
      Cookie: `sp_dc=${process.env.SPOTIFY_SP_DC}`
    }
  })
  const auth = (await res.json()) as SpdcAuthResponse
  if (auth.isAnonymous) {
    console.error('Failed to refresh Spotify access token - SP_DC is invalid')
    process.exit(1)
  }
  const accessToken = {
    access_token: auth.accessToken,
    token_type: 'Bearer',
    expires_in: Math.round(auth.accessTokenExpirationTimestampMs / 1000),
    refresh_token: ''
  } satisfies AccessToken
  writeFileSync(CACHE_FILENAME, JSON.stringify(accessToken))
  return accessToken
}

export async function getSpotifyAccessToken(): Promise<AccessToken> {
  return isCachedSpotifyTokenExpired()
    ? refreshSpotifyAccessToken()
    : readCacheFile()
}
