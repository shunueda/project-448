import { SpotifyApi } from '@spotify/web-api-ts-sdk'

const spotifyClient = SpotifyApi.withClientCredentials(
	import.meta.env.VITE_SPOTIFY_CLIENT_ID,
	import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
)
export default spotifyClient
