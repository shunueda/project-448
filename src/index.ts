import { createWriteStream, existsSync } from 'node:fs'
import { unlink, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import config from '~/assets/config.json'
import { writeMetadata } from '#ffmpeg/writeMetadata'
import { client } from '#spotify/client'
import { getPlaylistItems } from '#spotify/getPlaylistItems'
import { createVirtualFolder } from '#virtualdj/createVirtualFolder'
import { download } from '#youtube/download'

for (const { id, name } of config.playlists) {
  const playlist = await client.playlists.getPlaylist(id)
  const tracks = await getPlaylistItems(playlist.id)
  const paths: string[] = []
  for (const track of tracks) {
    const path = `assets/tracks/${track.id}.m4a`
    paths.push(join(process.cwd(), path))
    if (existsSync(path)) {
      continue
    }
    try {
      const data = await download(track)
      const ws = createWriteStream(path)
      await pipeline(data, ws)
      await writeMetadata(track, path)
      await writeFile(
        join(
          homedir(),
          'Library/Application Support/VirtualDJ/MyLists',
          `${playlist.name}.vdjfolder`
        ),
        createVirtualFolder(paths)
      )
    } catch (e) {
      console.error(
        `Error downloading track: ${JSON.stringify({
          id: track.id,
          name: track.name
        })}`
      )
      if (existsSync(path)) {
        await unlink(path)
      }
    }
  }
}
