import { type PathLike, createWriteStream, existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { mkdirp } from 'mkdirp'
import { directory, playlists } from '~/assets/config.json'
import { writeMetadata } from '#ffmpeg/writeMetadata'
import { getPlaylistItems } from '#spotify/getPlaylistItems'
import { createVdjFolder } from '#virtualdj/createVdjFolder'
import { download } from '#youtube/download'

const tracksDir = join(homedir(), directory.virtualdj, 'Tracks')
await mkdirp(tracksDir)

for (const { id, name } of playlists) {
  const tracks = await getPlaylistItems(id)
  const paths = new Set<PathLike>()
  for (const track of tracks) {
    const path = join(tracksDir, `${track.id}.m4a`)
    if (existsSync(path)) {
      paths.add(path)
      continue
    }
    try {
      const source = await download(track)
      const writeStream = createWriteStream(path)
      await pipeline(source, writeStream)
      await writeMetadata(track, path)
      paths.add(path)
    } catch (_) {
      console.error(
        `Error downloading track: ${JSON.stringify({
          id: track.id,
          name: track.name
        })}`
      )
    }
  }
  const vdjfolder = join(
    homedir(),
    directory.virtualdj,
    'MyLists',
    `${name}.vdjfolder`
  )
  await writeFile(vdjfolder, createVdjFolder(paths))
}
