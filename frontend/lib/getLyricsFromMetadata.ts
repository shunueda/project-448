import LyricsData from 'downloader/src/models/LyricsData'
import { IAudioMetadata } from 'music-metadata'

export default function getLyricsFromMetadata(
  metadata: IAudioMetadata
): LyricsData {
  return JSON.parse(
    metadata.native['ID3v2.4'].find(it => it.id === 'TXXX:USLT')?.value
  ) as LyricsData
}
