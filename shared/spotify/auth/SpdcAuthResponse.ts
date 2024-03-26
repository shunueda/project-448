export default interface SpdcAuthResponse {
  clientId: string
  accessToken: string
  accessTokenExpirationTimestampMs: number
  isAnonymous: boolean
}
