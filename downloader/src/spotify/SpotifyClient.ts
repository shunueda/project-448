import { Scopes, SpotifyApi } from '@spotify/web-api-ts-sdk'
import '../config'
import { getSpotifyAccessToken } from './auth/accessTokenManager'



const spotifyClient = SpotifyApi.withAccessToken(
  "528d589e2b714123acece8a25b96c900",
  (await getSpotifyAccessToken())
)

export default spotifyClient