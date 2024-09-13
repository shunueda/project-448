import { createWriteStream, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Track } from '@spotify/web-api-ts-sdk'
import { config } from 'common'
import { Utils } from 'youtubei.js'
import { writeMetadata } from '../metadata/writeMetadata'
import { download } from '../utils/download'
import { inntertube } from './innertube'

interface DirectoryOptions {
  tracks: string
  covers: string
}

export async function downloadAudio(
  track: Track,
  directoryOptions: DirectoryOptions
): Promise<string> {
  const localPath = resolve(directoryOptions.tracks, `${track.id}.m4a`)
  if (existsSync(localPath)) {
    return localPath
  }
  const videoId = await getYoutubeIdFromSpotifyTrack(track)
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
  await writeMetadata(localPath, {
    title: track.name,
    artist: track.artists.map(it => it.name),
    album: track.album.name,
    coverArtPath
  })
  return localPath
}

async function getYoutubeIdFromSpotifyTrack(track: Track) {
  if (config.overrides[track.id]) {
    return config.overrides[track.id]
  }
  const artists = track.artists.map(artist => artist.name).join(' ')
  const search = await inntertube.music.search(`${track.name} ${artists}`, {
    type: 'song'
  })
  // biome-ignore lint/style/noNonNullAssertion: assuming the song is always found
  return search.songs!.contents.find(song => song.title?.includes(track.name))!
    .id!
}
