import { readFileSync, writeFileSync } from 'node:fs'
import { EOL } from 'node:os'
import { parseEnv } from 'node:util'
import { $ } from 'zx'

// env
const env = parseEnv(readFileSync('.env').toString())
const envdts = `declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ${['NODE_ENV', ...Object.keys(env)].map(key => `${key}: string`).join(`${EOL}      `)}
    }
  }
}

export {}
`
writeFileSync('env.d.ts', envdts)

// precommit hook
await $`lefthook install`
