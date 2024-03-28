import VDJState from 'shared/src/vdj/VdjState'
import Websocket from 'ws'
import Config from '../config'

const ws = new Websocket(`ws://localhost:${Config.vdj_ws_port}`)

export default function runVdjScript(script: string): Promise<VDJState> {
  return new Promise((resolve, reject) => {
    ws.send(script)
    ws.onmessage = event => {
      resolve(JSON.parse(event.data.toString()))
    }
    ws.onerror = reject
  })
}
