import type { Track } from '@spotify/web-api-ts-sdk'
import { MultiBar, Presets } from 'cli-progress'
import { readdirSync, unlinkSync } from 'node:fs'
import { appendFile, stat } from 'node:fs/promises'
import { EOL } from 'node:os'
import xml from 'xml'
import Config from './config'
import getAllPlaylistItems from './spotify/getAllPlaylistItems'
import downloadAudio from './youtube/downloadAudio'

readdirSync(`${process.env.VDJ_DIR}/Playlists`)
  .filter(file => file.endsWith('.m3u'))
  .forEach(file => {
    unlinkSync(`${process.env.VDJ_DIR}/Playlists/${file}`)
  })

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
    for (const track of tracks) {
      bar.update({
        filename: `${playlist.name} | ${track.name}`
      })
      try {
        const m3uFilePath = `${process.env.VDJ_DIR}/Playlists/${playlist.name}.m3u`
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
