import WebSocket from 'ws'

const ws = new WebSocket('ws://localhost:8000')

ws.on('open', () => {
  ws.send('get_state')
  ws.onmessage = event => {
    console.log(JSON.parse(event.data))
    process.exit(0)
  }
})
