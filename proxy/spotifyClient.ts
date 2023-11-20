import { SpotifyApi } from '@spotify/web-api-ts-sdk'

const spotifyClient = SpotifyApi.withClientCredentials(
	process.env.SPOTIPY_CLIENT_ID as string,
	process.env.SPOTIPY_CLIENT_SECRET as string
)
export default spotifyClient
