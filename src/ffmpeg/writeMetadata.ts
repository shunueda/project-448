import type { PathLike } from 'node:fs'
import { rename, unlink, writeFile } from 'node:fs/promises'
import { path as ffmpeg } from '@ffmpeg-installer/ffmpeg'
import type { Track } from '@spotify/web-api-ts-sdk'
import { $, tempfile } from 'zx'

export async function writeMetadata(
  track: Track,
  path: PathLike
): Promise<void> {
  // download the cover art
  const cover = tempfile()
  await fetch(track.album.images[0].url)
    .then(it => it.arrayBuffer())
    .then(it => new Uint8Array(it))
    .then(it => writeFile(cover, it))

  // write the metadata
  const audio = tempfile()
  const options = [
    // allow overwriting
    ['-y'],
    // supress logging
    ['-hide_banner'],
    ['-loglevel', 'error'],
    // inputs
    ['-i', path],
    ['-i', cover],
    // copy the codecs
    ['-c', 'copy'],
    // output in m4a format
    ['-f', 'ipod'],
    // map inputs to outputs
    ['-map', '0:0'],
    ['-map', '1:0'],
    // attach the cover art
    ['-disposition:v', 'attached_pic'],
    // metadata
    ['-metadata', `artist=${track.artists.map(it => it.name).join('/')}`],
    ['-metadata', `title=${track.name}`],
    ['-metadata', `album=${track.album.name}`],
    // output
    [audio]
  ].flat()
  await $`${ffmpeg} ${options}`
  await unlink(path)
  await rename(audio, path)
}
