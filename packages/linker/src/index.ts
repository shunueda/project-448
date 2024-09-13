import { writeFile } from 'node:fs/promises'
import type { Track } from '@spotify/web-api-ts-sdk'
import { MultiBar, Presets } from 'cli-progress'
import { Directory, config, ensureVirtualDjState } from 'common'
import { downloadLyrics } from './spotify/downloadLyrics'
import { getAllPlaylistItems } from './spotify/getAllPlaylistItems'
import { spotifyClient } from './spotify/spotifyClient'
import { createVirtualFolder } from './virtualdj/createVirtualFolder'
import { downloadAudio } from './youtube/downloadAudio'

await ensureVirtualDjState({
  active: false
})

const progressBar = new MultiBar(
  {
    format:
      '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {filename}',
    stopOnComplete: true
  },
  Presets.shades_classic
)

config.playlistIds.forEach(async playlistId => {
  const playlist = await spotifyClient.playlists.getPlaylist(playlistId)
  const tracks = (await getAllPlaylistItems(playlistId)).map(
    ({ track }) => track as Track
  )
  const bar = progressBar.create(tracks.length, 0)
  const virtualFolderSongEntries: string[] = []
  for (const track of tracks) {
    bar.update({
      filename: `${playlist.name} | ${track.name}`
    })
    try {
      const path = await downloadAudio(track, {
        tracks: Directory.TRACKS,
        covers: Directory.COVERS
      })
      await downloadLyrics(track.id, Directory.LYRICS)
      virtualFolderSongEntries.push(path)
    } catch (error) {}
    bar.increment()
  }
  await writeFile(
    `${Directory.MY_LISTS}/${playlist.name}.vdjfolder`,
    createVirtualFolder(virtualFolderSongEntries)
  )
  bar.update({
    filename: `${playlist.name} | Completed`
  })
})
