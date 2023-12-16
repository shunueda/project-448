import { SpotifyApi } from '@spotify/web-api-ts-sdk'

const spotifyClient = SpotifyApi.withClientCredentials(
  process.env.SPOTIPY_CLIENT_ID,
  process.env.SPOTIPY_CLIENT_SECRET
)

export default spotifyClient