import { readFileSync } from 'fs'
import { parse } from 'yaml'
import { config } from 'dotenv'

interface ConfigDefinition {
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
