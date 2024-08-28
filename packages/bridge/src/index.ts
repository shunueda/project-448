import getPort, { portNumbers } from 'get-port'
import { handleSubscriptionData } from './handleSubscriptionData'
import { Os2lEvents } from './os2l/Os2lEvents'
import { Os2lProtocol } from './os2l/Os2lProtocol'
import { Server } from './os2l/Server'
import type { SubscriptionData } from './virtualdj/SubscriptionData'
import { Triggers } from './virtualdj/Triggers'

const server = new Server({
  port: await getPort({
    port: portNumbers(Os2lProtocol.PORT_MIN, Os2lProtocol.PORT_MAX)
  })
})

server.on(Os2lEvents.CONNECTION, () => {
  server.write({
    evt: 'subscribe',
    trigger: [Triggers.DECK_1_FILENAME, Triggers.CROSSFADER],
    frequency: '25'
  })
})

server.on(Os2lEvents.DATA, data => {
  if (data.evt !== 'subscribed') {
    return
  }
  console.log(data)
  handleSubscriptionData(data as SubscriptionData)
})

await server.start()
