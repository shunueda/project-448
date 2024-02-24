import { config } from 'dotenv'
import { readFileSync } from 'fs'
import { parse } from 'yaml'

interface ConfigDefinition {
  format: string
  playlists: Playlist[]
}

interface Playlist {
  name: string
  id: string
}

config({
  path: '../.env'
})

const Config = parse(
  readFileSync(
    `../config${process.env.NODE_ENV === 'development' ? '.development' : ''}.yaml`
  ).toString()
) as ConfigDefinition

export default Config
