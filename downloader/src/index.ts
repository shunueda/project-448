import { AccessToken, SpotifyApi } from '@spotify/web-api-ts-sdk'
import SpotifyAuth from './spotify/auth/SpotifyAuth'
import { getSpotifyAccessToken } from './spotify/auth/accessTokenManager'

const spotifyClient = SpotifyApi.withAccessToken(
  '528d589e2b714123acece8a25b96c900',
  await getSpotifyAccessToken()
)


// https://open.spotify.com/playlist/4QjIwCR4GwoorGkMgm0wvo?si=d4d3ba75d2804ef9&pt=23d10ce449f57781eef781d8304352ef
spotifyClient.playlists.getPlaylist('4QjIwCR4GwoorGkMgm0wvo').then(playlist => {
  console.log(playlist.description)
})