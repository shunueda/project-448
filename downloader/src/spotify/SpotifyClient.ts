import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import '../config'

const spotifyClient = SpotifyApi.withClientCredentials(
  process.env.SPOTIFY_CLIENT_ID,
  process.env.SPOTIFY_CLIENT_SECRET
)

export default spotifyClient