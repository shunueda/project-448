import type { Track } from '@spotify/web-api-ts-sdk'
import { MultiBar, Presets } from 'cli-progress'
import { writeFileSync } from 'fs'
import { appendFile, stat } from 'node:fs/promises'
import { EOL } from 'node:os'
import { Config, getAllPlaylistItems } from 'shared'
import xml from 'xml'
import downloadAudio from './youtube/downloadAudio'

const progressBar = new MultiBar(
  {
    format:
      '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {filename}',
    stopOnComplete: true
  },
  Presets.shades_classic
)

await Promise.all(
  Config.playlists.map(async playlist => {
    const tracks = (await getAllPlaylistItems(playlist.id)).map(
      ({ track }) => track as Track
    )
    const bar = progressBar.create(tracks.length, 0)
    const m3uFilePath = `${process.env.VDJ_DIR}/Playlists/${playlist.name}.m3u`
    writeFileSync(m3uFilePath, '')
    for (const track of tracks) {
      bar.update({
        filename: `${playlist.name} | ${track.name}`
      })
      try {
        const localPath = await downloadAudio(track, {
          tracksDir: `${process.env.VDJ_DIR}/Tracks`,
          coverArtsDir: `${process.env.VDJ_DIR}/CoverArts`,
          lyricsDir: `${process.env.VDJ_DIR}/Lyrics`
        })
        const filesize = (await stat(localPath)).size
        const artist = track.artists.map(artist => artist.name).join('/')
        const trackInfo = `#EXTVDJ:${xml({
          filesize,
          artist,
          title: track.name,
          songlength: track.duration_ms
        })}`
        await appendFile(m3uFilePath, trackInfo + EOL + localPath + EOL)
      } catch (_) {}
      bar.increment()
    }
    bar.update({
      filename: `${playlist.name} | ✔ Done!`
    })
  })
)
