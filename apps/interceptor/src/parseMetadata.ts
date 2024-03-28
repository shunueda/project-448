import { IAudioMetadata, parseFile } from 'music-metadata'

const cache = new Map<string, IAudioMetadata>()

export default async function parseMetadata(filepath: string) {
  if (cache.has(filepath)) {
    return cache.get(filepath)!
  }
  const metadata = await parseFile(filepath)
  cache.set(filepath, metadata)
  return metadata
}
