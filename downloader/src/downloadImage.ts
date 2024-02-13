import { createWriteStream } from 'fs'
import fetch from 'node-fetch'
import { promisify } from 'util'
import { pipeline } from 'stream'

export default async function downloadImage(url: string, localPath: string) {
  const response = await fetch(url)
  await promisify(pipeline)(response.body!, createWriteStream(localPath))
  return localPath
}