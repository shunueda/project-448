import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import Innertube, { UniversalCache } from 'youtubei.js'

const inntertube = await Innertube.create({
  cache: new UniversalCache(true, resolve(tmpdir(), 'project-448'))
})

export default inntertube
