import { $ } from 'zx'
import { envTypeGen } from './typegen/env.ts'
import { yamlTypeGen } from './typegen/yaml.ts'

await $`lefthook install`

yamlTypeGen('configs/development.yaml')
envTypeGen('.env.development')
