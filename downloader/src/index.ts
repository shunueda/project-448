import dotenv from 'dotenv'
import { getSpotifyAccessToken } from './spotify/accessTokenManager'

dotenv.config({
  path: `../${process.env.NODE_ENV === 'development' ? '.env.development' : '.env'}`
})

console.log(await getSpotifyAccessToken())