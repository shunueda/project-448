import { writeFile } from 'node:fs/promises'

export default async function downloadImage(url: string, localPath: string) {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  return writeFile(localPath, Buffer.from(arrayBuffer))
}
