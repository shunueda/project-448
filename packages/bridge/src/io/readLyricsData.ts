import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Directory } from 'common'
import { Charset, type LyricsData, lyricsDataSchema } from 'model'

const cache = new Map<string, LyricsData | null>()

export async function readLyricsData(id: string): Promise<LyricsData | null> {
  if (cache.has(id)) {
    return cache.get(id) || null
  }
  const lyricsFile = resolve(Directory.LYRICS, `${id}.json`)
  if (!existsSync(lyricsFile)) {
    cache.set(id, null)
    return null
  }
  const lyricsData = lyricsDataSchema.parse(
    JSON.parse(readFileSync(lyricsFile, Charset.UTF_8))
  )
  cache.set(id, lyricsData)
  return lyricsData
}
