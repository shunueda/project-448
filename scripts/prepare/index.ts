import { writeFileSync } from 'node:fs'
import { EOL } from 'node:os'
import { $ } from 'zx'

// env
const envdts = `declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ${Object.keys(process.env)
        .map(key => `${key}: string`)
        .join(`${EOL}      `)}
    }
  }
}

export {}
`
writeFileSync('env.d.ts', envdts)

// precommit hook
await $`lefthook install`
