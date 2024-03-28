import { Config, type VdjState } from 'shared'
import Websocket from 'ws'

const ws = new Websocket(`ws://localhost:${Config.vdj_ws_port}`)

export default function runVdjScript(script: string): Promise<VdjState> {
  return new Promise((resolve, reject) => {
    ws.send(script)
    ws.onmessage = event => {
      resolve(JSON.parse(event.data.toString()))
    }
    ws.onerror = reject
  })
}
