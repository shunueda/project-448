import { Endpoint } from '../lib/Endpoint'
import { lyricsDataSchema } from './LyricsData'
import { getSpotifyAccessToken } from './auth/getSpotifyAccessToken'

fetch(
  'https://spclient.wg.spotify.com/color-lyrics/v2/track/1gihuPhrLraKYrJMAEONyc/image/https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b273dcef905cb144d4867119850b?format=json&vocalRemoval=false&market=from_token',
  {
    cache: 'default',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en',
      'app-platform': 'WebPlayer',
      Authorization:
        'Bearer BQCewi9nS_kDSV-WvSZv7zytA7SOLbp8uY3WDzTK_Dr4cqqMLwSYhv7n3tx2zKVf8SDxU2pVIj91bVaOzbFlaC7aV54HjDtMSgYYPizKJwCHxOr85oPxQPUWHILe6lOHfUD3w3P0nK8Ja5dymQPQbYd-ZgM2bnDoBWyf1y5MxpgeMd58P0Ggm_uhidyDaKFcWBiN8T1mWal49k8MdSaLTkJMLZcU3EZYsgAzWarf7nLDBQ7C_X_BvLCWo3ZmD42pcJrjpoqRyeS8PKwR8ab7WhUF4ULecNoAD6fTb_ggN8YqBEag4e0WYaoPV5DsWKcANNDB5ZXHGwBSrtCfrABbGdZ6ZUVMxa9G_eWe3-F8',
      'client-token':
        'AAAHONPb2Q/wC3vAKbhTob+FisEFfIg9F5RMXiMtj0rA6A0yDmHZaItDbsZXZt9Mcn+h1p21DYh0CGJOin/JnuZiUGmyp9/WTmoELsenUb39GAP5NQOT1N4Ay4En7YmZI6hZUvl1gAwslI8Bk4mWnUYhbEYjeWO+NwBp8K6eM34uozTZLWoseR0LbJ9/to48C010xi+bYrD7J9hRf11wcHj1RdUQZMCAdN9nYU9E5G96qkQGOZEH3rcHWnaqX+Z+czZgx+a5mw6iQJypxR3T/XaphNFs3OzV0So7XW28ZAyr5tn9LB6qqfiZR2s='
    },
    method: 'GET',
    mode: 'cors',
    redirect: 'follow',
    referrer: 'https://open.spotify.com/',
    referrerPolicy: 'strict-origin-when-cross-origin'
  }
)

export async function fetchLyrics(trackId: string) {
  try {
    const { access_token } = await getSpotifyAccessToken()
    const url = new URL(
      `${Endpoint.SPOTIFY_LYRICS}/${trackId}?format=json&vocalRemoval=false`
    )
    const response = await fetch(url, {
      headers: {
        'app-platform': 'WebPlayer',
        Authorization: `Bearer ${access_token}`
      }
    })
    return lyricsDataSchema.safeParse(await response.json())
  } catch (error) {
    console.error(error)
    return
  }
}
