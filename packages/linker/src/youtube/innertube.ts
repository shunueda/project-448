import Innertube, { UniversalCache, ClientType } from 'youtubei.js'

export const inntertube = await Innertube.create({
  client_type: ClientType.TV_EMBEDDED,
  cache: new UniversalCache(true)
})
