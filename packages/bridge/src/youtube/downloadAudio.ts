import { createWriteStream, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Track } from '@spotify/web-api-ts-sdk'
import { config } from 'config'
import { Utils } from 'youtubei.js'
import { writeMetadata } from '../metadata/writeMetadata'
import { download } from '../utils/download'
import { inntertube } from './innertube'

interface DirectoryOptions {
  tracks: string
  covers: string
}

export default async function downloadAudio(
  track: Track,
  directoryOptions: DirectoryOptions
): Promise<string> {
  const localPath = resolve(
    directoryOptions.tracks,
    `${track.id}.${config.format}`
  )
  // if (existsSync(localPath)) {
  //   return localPath
  // }
  const artists = track.artists.map(artist => artist.name).join(' ')
  const videoId =
    config.overrides[track.id] ??
    (
      await inntertube.music.search(`${track.name} ${artists}`, {
        type: 'song'
      })
    ).songs?.contents[0].id
  // biome-ignore lint/style/noNonNullAssertion: videoId will be defined
  const stream = await inntertube.download(videoId!, {
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
  await writeMetadata(localPath, {
    title: track.name,
    artist: track.artists.map(artist => artist.name).join('/'),
    album: track.album.name,
    comment: track.id,
    coverArtPath
  })
  return localPath
}
