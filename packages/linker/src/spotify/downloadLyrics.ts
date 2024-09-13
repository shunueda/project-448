import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { SyncType } from 'common'
import { fetchLyrics } from './fetchLyrics'

export async function downloadLyrics(id: string, directory: string) {
  const lyricsData = await fetchLyrics(id)
  const lyricsDataPath = resolve(directory, `${id}.json`)
  if (lyricsData && lyricsData.lyrics.syncType === SyncType.LINE_SYNCED) {
    await writeFile(lyricsDataPath, JSON.stringify(lyricsData, null, 2))
  }
}
