import { EventEmitter } from 'node:events'
import net, { type Socket } from 'node:net'
import { type CiaoService, getResponder } from '@homebridge/ciao'
import { Charset } from 'common'
import { name } from '../../../../package.json'

interface ServerOptions {
  port: number
}

export class Server extends EventEmitter {
  private readonly port: number
  private readonly service: CiaoService
  private readonly clients: Socket[] = []
  private netServer?: net.Server

  constructor(options: Partial<ServerOptions>) {
    super()
    this.port = options.port || 8010
    this.service = getResponder().createService({
      name,
      type: 'os2l',
      port: this.port
    })
  }

  public async start() {
    await this.service.advertise()
    return new Promise<void>((resolve, reject) => {
      if (this.netServer) {
        reject('Server is already running!')
        return
      }
      this.netServer = net.createServer((client: Socket) => {
        this.clients.push(client)
        this.emit('connection')
        client.on('error', err => {
          client.destroy()
          const index = this.clients.indexOf(client)
          if (index >= 0) {
            this.clients.splice(index, 1)
          }
        })
        client.on('data', (buffer: Buffer) => {
          const data = buffer.toString(Charset.UTF_8).trim()
          try {
            const parsed = JSON.parse(data)
            this.emit('data', parsed)
            this.emit(parsed.evt, parsed)
          } catch (e) {
            this.emit('warning', `Bad OS2L package received=${data}`)
          }
        })
        client.on('end', () => {
          const index = this.clients.indexOf(client)
          if (index >= 0) {
            this.clients.splice(index, 1)
          }
        })
      })
      this.netServer.on('error', err => {
        this.emit('error', err)
        reject()
      })
      this.netServer.listen(this.port, () => {
        resolve()
      })
    })
  }

  public write(data: unknown) {
    for (const client of this.clients) {
      client.write(JSON.stringify(data))
    }
  }

  public async stop() {
    if (!this.netServer) {
      this.emit('warning', 'Server is not running, cannot stop server')
      return
    }
    this.netServer.close()
    this.netServer.unref()
    this.netServer = undefined

    if (this.service) {
      await this.service.end()
      await this.service.destroy()
    }
    this.emit('closed')
  }
}
