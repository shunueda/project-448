import type { Track } from '@spotify/web-api-ts-sdk'
import Config from 'config'
import { existsSync } from 'fs'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import { Utils } from 'youtubei.js'
import downloadImage from '../downloadImage'
import writeMetadata, { AudioMetadata } from '../writeMetadata'
import inntertube from './inntertube'

interface DirectoryOptions {
  tracksDir: string
  coverArtsDir: string
  lyricsDir: string
}

export default async function downloadAudio(
  track: Track,
  directoryOptions: DirectoryOptions
): Promise<string> {
  const localPath = resolve(
    directoryOptions.tracksDir,
    `${track.name}.${Config.format}`
  )
  if (existsSync(localPath)) {
    return localPath
  }
  const artists = track.artists.map(artist => artist.name).join(' ')
  const videoId =
    Config.overrides.find(it => it.spotify === track.id)?.youtube ||
    (
      await inntertube.music.search(
        `${track.name} ${artists} ${track.album.name}`,
        {
          type: 'song'
        }
      )
    ).songs!.contents[0].flex_columns[0].title.endpoint!.payload.videoId
  const stream = await inntertube.download(videoId, {
    type: 'audio',
    quality: 'best'
  })
  const file = createWriteStream(localPath)
  for await (const chunk of Utils.streamToIterable(stream)) {
    file.write(chunk)
  }
  const coverArtPath = resolve(directoryOptions.coverArtsDir, `${track.id}.jpg`)
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
