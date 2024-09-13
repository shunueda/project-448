import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getEnvironment } from 'model'
import { parse } from 'yaml'
import { number, object, record, string } from 'zod'
import { Directory } from './Directory'

const configSchema = object({
  playlistIds: string().array(),
  overrides: record(string(), string()),
  lyrics: object({
    lines: number(),
    offset: number()
  })
})

const yaml = parse(
  readFileSync(
    join(Directory.CONFIGS, `${getEnvironment(process.env.NODE_ENV)}.yaml`)
  ).toString()
)

export const config = configSchema.parse(yaml)
