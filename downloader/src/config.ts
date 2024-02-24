import { config } from 'dotenv'
import { readdirSync, readFileSync } from 'fs'
import { unlink } from 'node:fs/promises'
import { parse } from 'yaml'

const isDevelopment = process.env.NODE_ENV === 'development'

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
    `../config${isDevelopment ? '.development' : ''}.yaml`
  ).toString()
) as ConfigDefinition

if (isDevelopment) {
  await Promise.all(
    readdirSync(`${process.env.VDJ_DIR}/Tracks`)
      .filter(file => file.endsWith(`.${Config.format}`))
      .map(file => unlink(`${process.env.VDJ_DIR}/Tracks/${file}`))
  )
}

export default Config
