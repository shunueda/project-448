import { writeFileSync } from 'node:fs'
import { EOL } from 'node:os'
import { parse } from 'dotenv'

export function envTypeGen(filename: string, outfile: string) {
  const envFile = parse(filename)
  const keys = Object.keys(envFile)
  const content = keys.map(key => `${key}: string`).join(EOL)
  const envdts = `
declare global {
  namespace NodeJS {
    interface ProcessEnv { ${content} }
  }
}
export {}
`
  writeFileSync(outfile, envdts)
}
