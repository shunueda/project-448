import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { getSpotifyAccessToken } from './auth/getSpotifyAccessToken'

export const spotifyClient = SpotifyApi.withAccessToken(
  process.env.SPOTIFY_CLIENT_ID,
  await getSpotifyAccessToken()
)
