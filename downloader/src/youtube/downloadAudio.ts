import type { Track } from '@spotify/web-api-ts-sdk'
import ytdl from 'ytdl-core'
import ffmpeg from 'ffmpeg-static'
import ffmetadata from 'ffmetadata'
import { resolve as resolvePath } from 'path'
import {
  spawn,
  type SpawnOptionsWithStdioTuple,
  type StdioNull,
  type StdioPipe
} from 'child_process'
import { existsSync } from 'fs'
import { Writable } from 'stream'
import { mkdirp } from 'mkdirp'
import downloadImage from '../downloadImage'

ffmetadata.setFfmpegPath(ffmpeg!)

export interface TrackWithLocalPath extends Track {
  localPath: string
}

interface DirectoryOptions {
  tracksDir: string
  coverArtDir: string
}

export default function downloadAudio(
  url: string,
  track: Track,
  directoryOptions: DirectoryOptions
): Promise<TrackWithLocalPath> {
  return new Promise(async (resolve, reject) => {
    try {
      await Promise.all(
        [directoryOptions.coverArtDir, directoryOptions.tracksDir].map(mkdirp)
      )
      const localPath = resolvePath(
        directoryOptions.tracksDir,
        `${track.name}.mp3`
      )
      if (existsSync(localPath)) {
        resolve({
          ...track,
          localPath
        })
        return
      }
      const stream = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio'
      })
      const ffmpegProcess = spawn(
        ffmpeg!,
        [
          '-loglevel',
          '8',
          '-hide_banner',
          '-progress',
          'pipe:3',
          '-i',
          'pipe:4',
          `${localPath}`
        ],
        {
          windowsHide: true,
          stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe']
        } as unknown as SpawnOptionsWithStdioTuple<
          StdioPipe,
          StdioPipe,
          StdioNull
        >
      )
      const thumbnailPath = resolvePath(
        directoryOptions.coverArtDir,
        `${track.id}.jpg`
      )
      if (!existsSync(thumbnailPath)) {
        await downloadImage(track.album.images[0].url, thumbnailPath)
      }
      ffmpegProcess.on('close', async () => {
        const metadata = {
          artist: track.artists.map(artist => artist.name).join('/'),
          title: track.name,
          album: track.album.name,
          comment: track.id
        }
        ffmetadata.write(
          localPath,
          metadata,
          {
            attachments: [thumbnailPath]
          },
          err => {
            if (err) {
              reject(err)
            }
            resolve({
              ...track,
              localPath
            })
          }
        )
      })
      stream.pipe(ffmpegProcess.stdio[4] as Writable)
    } catch (e) {
      reject(e)
    }
  })
}
