import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AccessToken } from '@spotify/web-api-ts-sdk'
import { Charset } from '../../lib/Charset'
import { Endpoint } from '../../lib/Endpoint'
import type { SpdcAuthResponse } from './SpdcAuthResponse'

const CACHE_FILENAME = '.spotify-access-token'

function readCacheFile(): AccessToken {
  return JSON.parse(readFileSync(CACHE_FILENAME, Charset.UTF_8))
}

function isCachedSpotifyTokenExpired(): boolean {
  return (
    !existsSync(CACHE_FILENAME) ||
    readCacheFile().expires_in < Date.now() / 1000
  )
}

async function refreshSpotifyAccessToken(): Promise<AccessToken> {
  const response = await fetch(Endpoint.SPOTIFY_ACCESS_TOKEN, {
    headers: {
      Cookie: `sp_dc=${process.env.SPOTIFY_SP_DC}`
    }
  })
  const auth: SpdcAuthResponse = await response.json()
  if (auth.isAnonymous) {
    console.error('Failed to refresh Spotify access token - SP_DC is invalid')
    process.exit(1)
  }
  const accessToken: AccessToken = {
    access_token: auth.accessToken,
    token_type: 'Bearer',
    expires_in: Math.round(auth.accessTokenExpirationTimestampMs / 1000),
    refresh_token: ''
  }
  writeFileSync(CACHE_FILENAME, JSON.stringify(accessToken), Charset.UTF_8)
  return accessToken
}

export async function getSpotifyAccessToken(): Promise<AccessToken> {
  return isCachedSpotifyTokenExpired()
    ? refreshSpotifyAccessToken()
    : readCacheFile()
}
