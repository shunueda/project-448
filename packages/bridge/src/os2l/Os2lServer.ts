import { EventEmitter } from 'node:events'
import type net from 'node:net'
import { type Socket, createServer } from 'node:net'
import { type CiaoService, getResponder } from '@homebridge/ciao'
import { Charset } from 'model'
import { Event } from './Event'
import { Protocol } from './Protocol'

interface ServerOptions {
  name: string
  port: number
}

export class Os2lServer extends EventEmitter {
  private readonly type = 'os2l'
  private readonly jsonRegex = /(\{.*?})/g
  private readonly port: number
  private readonly service: CiaoService
  private readonly clients: Socket[] = []
  private netServer: net.Server

  constructor(options: Partial<ServerOptions>) {
    super()
    this.port = options.port || Protocol.PORT_MIN
    this.service = getResponder().createService({
      name: options.name || Os2lServer.name,
      type: this.type,
      port: this.port
    })
    this.netServer = createServer(client => {
      this.clients.push(client)
      client
        .on(Event.DATA, (buffer: Buffer) => {
          buffer
            .toString(Charset.UTF_8)
            .match(this.jsonRegex)
            ?.forEach(line => {
              try {
                const parsed = JSON.parse(line)
                this.emit(Event.DATA, parsed)
                this.emit(parsed.evt, parsed)
              } catch (e) {
                this.emit(Event.WARNING, `Could not parse: ${line} (${e})`)
              }
            })
        })
        .on(Event.END, () => {
          const index = this.clients.indexOf(client)
          if (index >= 0) {
            this.clients.splice(index, 1)
          }
        })
      this.emit(Event.CONNECTION)
    }).on(Event.ERROR, err => this.emit(Event.ERROR, err))
  }

  public async start() {
    await this.service.advertise()
    return new Promise<void>(resolve => {
      if (this.netServer.listening) {
        this.emit(Event.WARNING, 'Server is already running')
        return resolve()
      }
      this.netServer.listen(this.port, resolve)
    })
  }

  public write<T>(data: T) {
    this.clients.forEach(client => client.write(JSON.stringify(data)))
  }

  public async stop() {
    if (!this.netServer.listening) {
      this.emit(Event.WARNING, 'Server is not running, cannot stop server')
      return
    }
    this.netServer.close()
    this.netServer.unref()
    await this.service.end()
    await this.service.destroy()
    this.emit(Event.CLOSED)
  }
}
