import { createWriteStream, existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { playlists } from '~/assets/config.json'
import { writeMetadata } from '#ffmpeg/writeMetadata'
import { getPlaylistItems } from '#spotify/getPlaylistItems'
import { createVirtualFolder } from '#virtualdj/createVirtualFolder'
import { download } from '#youtube/download'

for (const { id, name } of playlists) {
  const tracks = await getPlaylistItems(id)
  const paths = new Set<string>()
  for (const track of tracks) {
    const path = join(process.cwd(), `assets/tracks/${track.id}.m4a`)
    if (existsSync(path)) {
      paths.add(path)
      continue
    }
    try {
      const source = await download(track)
      const ws = createWriteStream(path)
      await pipeline(source, ws)
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
  await writeFile(
    join(
      homedir(),
      `Library/Application Support/VirtualDJ/MyLists/${name}.vdjfolder`
    ),
    createVirtualFolder(paths)
  )
}
