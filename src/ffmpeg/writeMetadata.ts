import { rename, unlink, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { path as ffmpeg } from '@ffmpeg-installer/ffmpeg'
import type { Track } from '@spotify/web-api-ts-sdk'
import { $, tempfile } from 'zx'

export async function writeMetadata(track: Track, path: string): Promise<void> {
  // download the cover art
  const cover = `assets/covers/${track.id}.jpg`
  const response = await fetch(track.album.images[0].url)
  const buffer = await response.arrayBuffer().then(Buffer.from)
  await writeFile(cover, buffer)

  const temp = tempfile(basename(path))
  const options = [
    // allow overwriting
    '-y',
    // supress logging
    '-hide_banner',
    ['-loglevel', 'error'],
    // inputs
    ['-i', path],
    ['-i', cover],
    // copy the codecs
    ['-c', 'copy'],
    // map inputs to outputs
    ['-map', '0:0'],
    ['-map', '1:0'],
    // attach the cover art
    ['-disposition:v', 'attached_pic'],
    // metadata
    ['-metadata', `artist=${track.artists.map(it => it.name).join('/')}`],
    ['-metadata', `title=${track.name}`],
    ['-metadata', `album=${track.album.name}`],
    temp
  ].flat()
  await $`${ffmpeg} ${options}`
  await unlink(path)
  await rename(temp, path)
}
