import { IAudioMetadata } from 'music-metadata'

const cache = new Map<string, IAudioMetadata>()

export default async function getMetadata(filepath: string) {
  if (cache.has(filepath)) {
    return cache.get(filepath)!
  }
  const res = await fetch('/api/getMetadata', {
    method: 'POST',
    body: JSON.stringify({ filepath })
  })
  const json = await res.json() as IAudioMetadata
  cache.set(filepath, json)
  return json
}