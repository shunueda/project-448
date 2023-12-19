import { IAudioMetadata } from 'music-metadata'
import LyricsData from 'downloader/src/models/LyricsData'

export default function getLyricsFromMetadata(metadata: IAudioMetadata): LyricsData {
  return JSON.parse(metadata.native['ID3v2.4'].find(it => it.id === 'TXXX:USLT')?.value) as LyricsData
}