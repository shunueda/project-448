import Config from 'config'
import { setInterval } from 'node:timers/promises'
import { WebSocketServer } from 'ws'
import runVdjScript from './vdj/runVdjScript'

const ws = new WebSocketServer({ port: Config.interceptor_ws_port })

for await (const _ of setInterval(Config.interceptor_interval)) {
  const vdjState = await runVdjScript('get_state')
}
