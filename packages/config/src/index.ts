import development from '../../../configs/development.json'
import production from '../../../configs/production.json'

const isProduction = process.env.NODE_ENV === 'production'

export const config: Config = isProduction ? production : development

export interface Config {
  format: string
  playlists: string[]
  overrides: Override
}

export interface Override extends Record<string, string> {}
