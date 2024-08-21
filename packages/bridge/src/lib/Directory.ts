import { mkdirp } from 'mkdirp'
import { name } from '../../../../package.json'

const customDir = `${process.env.VIRTUAL_DJ_DIR}/${name}`

export const Directory = {
  MY_LISTS: `${process.env.VIRTUAL_DJ_DIR}/MyLists`,
  TRACKS: `${customDir}/Tracks`,
  COVERS: `${customDir}/Covers`
} satisfies Readonly<Record<string, string>>

Object.values(Directory).forEach(async dir => {
  await mkdirp(dir)
})
