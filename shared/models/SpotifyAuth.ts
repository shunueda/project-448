export default interface SpotifyAuth {
  clientId: string
  accessToken: string
  accessTokenExpirationTimestampMs: number
  isAnonymous: boolean
}