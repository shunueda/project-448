import { createWriteStream, existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Track } from '@spotify/web-api-ts-sdk'
import { config } from 'common'
import { Utils } from 'youtubei.js'
import { writeMetadata } from '../metadata/writeMetadata'
import { SyncType } from '../spotify/LyricsData'
import { fetchLyrics } from '../spotify/fetchLyrics'
import { download } from '../utils/download'
import { inntertube } from './innertube'

interface DirectoryOptions {
  tracks: string
  covers: string
  lyrics: string
}

export async function downloadAudio(
  track: Track,
  directoryOptions: DirectoryOptions
): Promise<string> {
  const localPath = resolve(directoryOptions.tracks, `${track.id}.m4a`)
  if (existsSync(localPath)) {
    return localPath
  }
  const artists = track.artists.map(artist => artist.name).join(' ')
  const videoId =
    config.overrides[track.id] ??
    (
      await inntertube.music.search(`${track.name} ${artists}`, {
        type: 'song'
      })
    ).songs?.contents[0].id
  const stream = await inntertube.download(videoId, {
    type: 'audio',
    quality: 'best',
    client: 'TV_EMBEDDED'
  })
  const writeStream = createWriteStream(localPath)
  for await (const chunk of Utils.streamToIterable(stream)) {
    writeStream.write(chunk)
  }
  const coverArtPath = resolve(directoryOptions.covers, `${track.id}.jpg`)
  await download(track.album.images[0].url, coverArtPath)
  const lyricsData = await fetchLyrics(track.id)
  const lyricsDataPath = resolve(directoryOptions.lyrics, `${track.id}.json`)
  if (lyricsData && lyricsData.lyrics.syncType === SyncType.LINE_SYNCED) {
    await writeFile(lyricsDataPath, JSON.stringify(lyricsData, null, 2))
  }
  await writeMetadata(localPath, {
    title: track.name,
    artist: track.artists.map(it => it.name),
    album: track.album.name,
    comment: track.id,
    coverArtPath
  })
  return localPath
}
