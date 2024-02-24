import ffmpegPath from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import { rename, unlink } from 'node:fs/promises'
import config from './config'

export interface AudioMetadata {
  artist: string
  title: string
  album: string
  comment: string
  coverArtPath: string
}

export default async function writeMetadata(
  localPath: string,
  metadata: AudioMetadata
) {
  const tempPath = localPath.replace(
    `.${config.format}`,
    `.metadata.${config.format}`
  )
  const ffmpegArgs = [
    '-i',
    localPath,
    '-i',
    metadata.coverArtPath,
    '-map',
    '0:0',
    '-map',
    '1:0',
    '-metadata',
    `artist=${metadata.artist}`,
    '-metadata',
    `title=${metadata.title}`,
    '-metadata',
    `album=${metadata.album}`,
    '-metadata',
    `comment=${metadata.comment}`,
    '-c',
    'copy',
    '-c:v',
    'copy',
    '-disposition:v',
    'attached_pic',
    tempPath
  ]
  const ffmpeg = spawn(ffmpegPath!, ffmpegArgs)
  return new Promise<void>(async (resolve, reject) => {
    ffmpeg.on('close', async code => {
      if (code === 0) {
        await unlink(localPath)
        await rename(tempPath, localPath)
        resolve()
      } else {
        reject()
      }
    })
  })
}
