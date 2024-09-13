import death from 'death'
import getPort, { portNumbers } from 'get-port'
import { name } from 'project-448/package.json'
import { BridgeStateManager } from './BridgeStateManager'
import { Event } from './os2l/Event'
import { Os2lServer } from './os2l/Os2lServer'
import { Protocol } from './os2l/Protocol'
import { Trigger } from './virtualdj/Trigger'

const bridgeStatemanager = new BridgeStateManager()

const port = await getPort({
  port: portNumbers(Protocol.PORT_MIN, Protocol.PORT_MAX)
})
const server = new Os2lServer({ name, port })

await server
  .on(Event.CONNECTION, () => {
    console.log('Connected')
    server.write({
      evt: Event.SUBSCRIBE,
      trigger: Object.values(Trigger),
      frequency: 100
    })
  })
  .on(Event.SUBSCRIBED, async data => {
    try {
      await bridgeStatemanager.update(data)
    } catch (e) {}
  })
  .on(Event.ERROR, console.error)
  .on(Event.WARNING, console.warn)
  .start()

death(async () => {
  await server.stop()
  process.exit()
})
