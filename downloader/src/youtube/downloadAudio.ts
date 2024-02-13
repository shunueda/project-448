import { Track } from '@spotify/web-api-ts-sdk'
import ytdl from 'ytdl-core'
import ffmpeg from 'ffmpeg-static'
import ffmetadata from 'ffmetadata'
import path from 'path'
import { spawn, SpawnOptionsWithStdioTuple, StdioNull, StdioPipe } from 'child_process'
import { existsSync } from 'fs'
import { Writable } from 'stream'
import { mkdirp } from 'mkdirp'
import downloadImage from '../downloadImage'
import fetchLyrics from '../spotify/fetchLyrics'
import { readdir } from 'node:fs/promises'

const tmp = 'tmp'

ffmetadata.setFfmpegPath(ffmpeg!)

export interface TrackWithLocalPath extends Track {
  localPath: string
}

export default function downloadAudio(url: string, track: Track, direcotry: string): Promise<TrackWithLocalPath> {
  return new Promise(async (resolve, reject) => {
    const pathname = path.resolve(process.cwd(), direcotry, `${track.name}.mp3`)
    if (existsSync(pathname)) {
      resolve({
        ...track,
        localPath: pathname
      })
      return
    }
    const lyrics = await fetchLyrics(track.id)
    if (lyrics === undefined) {
      reject()
      return
    }
    await mkdirp(tmp)
    await mkdirp(direcotry)
    const stream = ytdl(url, {
      filter: 'audioonly',
      quality: 'highestaudio'
    })
    const ffmpegProcess = spawn(ffmpeg!, [
      '-loglevel', '8', '-hide_banner',
      '-progress', 'pipe:3',
      '-i', 'pipe:4',
      `${pathname}`
    ], {
      windowsHide: true,
      stdio: [
        'inherit', 'inherit', 'inherit',
        'pipe', 'pipe'
      ]
    } as unknown as SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>)
    const thumbnailPath = `${tmp}/${track.id}.jpg`
    if (!existsSync(thumbnailPath)) {
      await downloadImage(track.album.images[0].url, thumbnailPath)
    }
    ffmpegProcess.on('close', async () => {
      const metadata = {
        artist: track.artists.map(artist => artist.name).join('/'),
        title: track.name,
        album: track.album.name,
        lyrics
      }
      ffmetadata.write(pathname, metadata, {
        attachments: [path.resolve(process.cwd(), thumbnailPath)]
      }, err => {
        if (err) {
          reject(err)
        }
        resolve({
          ...track,
          localPath: pathname
        })
      })
    })
    stream.pipe(ffmpegProcess.stdio[4] as Writable)
  })
}