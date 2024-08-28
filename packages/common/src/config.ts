import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import { object, record, string } from 'zod'
import { Directory } from './lib/Directory'
import { getEnvironment } from './lib/Environment'

const configSchema = object({
  playlistIds: string().array(),
  overrides: record(string(), string())
})

const yaml = parse(
  readFileSync(
    join(Directory.CONFIGS, `${getEnvironment(process.env.NODE_ENV)}.yaml`)
  ).toString()
)

export const config = configSchema.parse(yaml)
