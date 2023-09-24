import { Config } from '@remotion/cli/config'
import os from 'os'

Config.setEntryPoint('src/index.ts')
Config.setConcurrency(os.cpus().length)
Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)
