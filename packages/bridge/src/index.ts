import { writeFile } from 'node:fs/promises'
import type { Track } from '@spotify/web-api-ts-sdk'
import { config } from 'config'
import { Charset } from './lib/Charset'
import { Directory } from './lib/Directory'
import { getAllPlaylistItems } from './spotify/getAllPlaylistItems'
import { spotifyClient } from './spotify/spotifyClient'
import { createVirtualFolderFromPaths } from './virtualdj/createVirtualFolderFromPaths'
import downloadAudio from './youtube/downloadAudio'

// const progressBar = new MultiBar(
//   {
//     format:
//       '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {filename}',
//     stopOnComplete: true
//   },
//   Presets.shades_classic
// )

config.playlists.map(async playlistId => {
  const playlist = await spotifyClient.playlists.getPlaylist(playlistId)
  const tracks = (await getAllPlaylistItems(playlistId)).map(
    ({ track }) => track as Track
  )
  // const bar = progressBar.create(tracks.length, 0)
  const virtualFolderSongEntries: string[] = []
  for (const track of tracks) {
    const path = await downloadAudio(track, {
      tracks: Directory.TRACKS,
      covers: Directory.COVERS
    })
    virtualFolderSongEntries.push(path)
  }
  await writeFile(
    `${Directory.MY_LISTS}/${playlist.name}.vdjfolder`,
    createVirtualFolderFromPaths(virtualFolderSongEntries),
    Charset.UTF_8
  )
  // bar.increment()
  // bar.update({
  //   filename: `${playlist.name} | √ Done!`
  // })
})
