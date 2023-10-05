import { Config } from '@remotion/cli/config'

Config.setEntryPoint('src/index.ts')
Config.setConcurrency(10)
Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)
