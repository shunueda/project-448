import type { Track } from '@spotify/web-api-ts-sdk'
import { existsSync } from 'fs'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import { Utils } from 'youtubei.js'
import config from '../config'
import downloadImage from '../downloadImage'
import writeMetadata, { AudioMetadata } from '../writeMetadata'
import inntertube from './inntertube'

interface DirectoryOptions {
  tracksDir: string
  coverArtDir: string
}

export default async function downloadAudio(
  track: Track,
  directoryOptions: DirectoryOptions
): Promise<string> {
  const localPath = resolve(
    directoryOptions.tracksDir,
    `${track.name}.${config.format}`
  )
  if (existsSync(localPath)) {
    return localPath
  }
  const artists = track.artists.map(artist => artist.name).join(' ')
  const search = await inntertube.music.search(`${track.name} ${artists}`, {
    type: 'song'
  })
  const videoId =
    search.songs!.contents[0].flex_columns[0].title.endpoint!.payload.videoId
  const stream = await inntertube.download(videoId, {
    type: 'audio',
    quality: 'best'
  })
  const file = createWriteStream(localPath)
  for await (const chunk of Utils.streamToIterable(stream)) {
    file.write(chunk)
  }
  const coverArtPath = resolve(directoryOptions.coverArtDir, `${track.id}.jpg`)
  if (!existsSync(coverArtPath)) {
    await downloadImage(track.album.images[0].url, coverArtPath)
  }
  const metadata: AudioMetadata = {
    title: track.name,
    artist: track.artists.map(artist => artist.name).join('/'),
    album: track.album.name,
    comment: track.id,
    coverArtPath
  }
  await writeMetadata(localPath, metadata)
  return localPath
}
