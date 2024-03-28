import { config } from 'dotenv'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

const isDevelopment = false // just for now

interface ConfigDefinition {
  format: string
  playlists: Playlist[]
  overrides: Override[]
  interceptor_interval: number
  interceptor_tolerance: number
  vdj_ws_port: number
}

interface Playlist {
  name: string
  id: string
}

interface Override {
  spotify: string
  youtube: string
}

config({
  path: '../../.env'
})

export const Config = parse(
  readFileSync(
    `../../config${isDevelopment ? '.development' : ''}.yaml`
  ).toString()
) as ConfigDefinition

export default Config
