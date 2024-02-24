import Innertube, { UniversalCache } from 'youtubei.js'

const inntertube = await Innertube.create({
  cache: new UniversalCache(true)
})

export default inntertube
