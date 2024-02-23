import Config from './config'
import { MultiBar, SingleBar } from 'cli-progress'
import getYouTubeUrl from './youtube/getYouTubeUrl'
import override from './override'
import downloadAudio from './youtube/downloadAudio'
import { appendFileSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { parseFile } from 'music-metadata'
import { EOL } from 'node:os'
import xml from 'xml'
import getAllPlaylistItems from './spotify/getAllPlaylistItems'
import { Track } from '@spotify/web-api-ts-sdk'
import { downloadTrack, getTrack } from 'spottydl'

readdirSync(`${process.env.VDJ_DIR}/Playlists`)
  .filter(file => file.endsWith('.m3u'))
  .forEach(file => {
    unlinkSync(`${process.env.VDJ_DIR}/Playlists/${file}`)
  })

const progressBar = new MultiBar({
  format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {filename}'
})

await Promise.all(
  Config.playlists.map(async playlist => {
    const tracks = (await getAllPlaylistItems(playlist.id)).map(
      ({ track }) => track as Track
    )
    const bar = progressBar.create(tracks.length, 0)
    for (const track of tracks) {
      bar.update({
        filename: track.name
      })
      try {
        // const musicUrl = await getYouTubeUrl(track, override)
        const m3uFilePath = `${process.env.VDJ_DIR}/Playlists/${playlist.name}.m3u`
        // const trackWithLocalPath = await downloadAudio(musicUrl, track, {
        //   tracksDir: `${process.env.VDJ_DIR}/Tracks`,
        //   coverArtDir: `${process.env.VDJ_DIR}/CoverArts`
        // })
        const a = await getTrack(track.href)
        const localPath = `${process.env.VDJ_DIR}/Tracks/${track.name}.mp3`
        const filesize = statSync(localPath).size
        const metadata = await parseFile(localPath)
        const artist = track.artists.map(artist => artist.name).join('/')
        const trackInfo = `#EXTVDJ:${xml({
          filesize,
          artist,
          title: track.name,
          songlength: metadata.format.duration
        })}`
        appendFileSync(m3uFilePath, trackInfo + EOL + localPath + EOL)
      } catch (_) {}
      bar.increment()
    }
    bar.update({
      filename: '✅ Done!'
    })
  })
)

process.exit(0)
