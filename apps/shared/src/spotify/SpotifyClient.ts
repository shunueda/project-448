import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { getSpotifyAccessToken } from './auth/accessTokenManager'

export const spotifyClientWithAccessToken = SpotifyApi.withAccessToken(
  process.env.SPOTIFY_CLIENT_ID,
  await getSpotifyAccessToken()
)

export const spotifyClient = SpotifyApi.withClientCredentials(
  process.env.SPOTIFY_CLIENT_ID,
  process.env.SPOTIFY_CLIENT_SECRET
)
