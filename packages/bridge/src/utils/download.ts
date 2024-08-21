import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'

export async function download(url: string, path: string) {
  if (!existsSync(path)) {
    return
  }
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  await writeFile(path, Buffer.from(arrayBuffer))
  return path
}
