const ws = new WebSocket('ws://localhost:8000')

export default function runVdjScript(script: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ws.send(script)
    ws.onmessage = event => {
      resolve(event.data)
    }
  })
}
