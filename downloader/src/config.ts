import { config } from 'dotenv'
import { readFileSync } from 'fs'
import { parse } from 'yaml'

const isDevelopment = process.env.NODE_ENV === 'development'

interface ConfigDefinition {
  format: string
  playlists: Playlist[]
  overrides: Override[]
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
  path: '../.env'
})

const Config = parse(
  readFileSync(
    `../config${isDevelopment ? '.development' : ''}.yaml`
  ).toString()
) as ConfigDefinition

// if (isDevelopment) {
//   await Promise.all(
//     readdirSync(`${process.env.VDJ_DIR}/Tracks`)
//       .filter(file => file.endsWith(`.${Config.format}`))
//       .map(file => unlink(`${process.env.VDJ_DIR}/Tracks/${file}`))
//   )
// }

export default Config
