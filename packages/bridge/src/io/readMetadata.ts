import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Directory } from 'common'
import { type IAudioMetadata, parseBuffer } from 'music-metadata'

const cache = new Map<string, IAudioMetadata>()

export async function readMetadata(id: string) {
  if (cache.has(id)) {
    // biome-ignore lint/style/noNonNullAssertion: checked if key exists
    return cache.get(id)!
  }
  const path = join(Directory.TRACKS, `${id}.m4a`)
  const buffer = await readFile(path)
  const metadata = await parseBuffer(buffer)
  cache.set(id, metadata)
  return metadata
}
