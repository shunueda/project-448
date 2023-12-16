import { createWriteStream } from 'fs'
import fetch from 'node-fetch'
import { promisify } from 'util'
import { pipeline } from 'stream'

export default async function downloadImage(url, localPath) {
  const response = await fetch(url)
  const streamPipeline = promisify(pipeline)
  await streamPipeline(response.body, createWriteStream(localPath))
  return localPath
}