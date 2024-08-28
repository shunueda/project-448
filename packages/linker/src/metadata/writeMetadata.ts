import { rename, unlink } from 'node:fs/promises'
import { basename } from 'node:path'
import { $, tempfile } from 'zx'

export interface AudioMetadata {
  artist: string[]
  title: string
  album: string
  comment: string
  coverArtPath: string
}

export async function writeMetadata(
  localPath: string,
  metadata: AudioMetadata
) {
  const tempPath = tempfile(basename(localPath))
  const options = [
    // allow overwriting
    '-y',
    // supress logging
    '-hide_banner',
    ['-loglevel', 'error'],
    // inputs
    ['-i', localPath],
    ['-i', metadata.coverArtPath],
    // copy the codecs
    ['-c', 'copy'],
    // map inputs to outputs
    ['-map', '0:0'],
    ['-map', '1:0'],
    // attach the cover art
    ['-disposition:v', 'attached_pic'],
    // metadata
    ['-metadata', `artist=${metadata.artist.join('/')}`],
    ['-metadata', `title=${metadata.title}`],
    ['-metadata', `album=${metadata.album}`],
    ['-metadata', `comment=${metadata.comment}`],
    // ['-metadata', `lyrics=${JSON.stringify(metadata.lyricsData, null, 2)}`],
    tempPath
  ].flat()
  await $`ffmpeg ${options}`
  await unlink(localPath)
  await rename(tempPath, localPath)
}
