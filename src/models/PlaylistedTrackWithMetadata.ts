import { PlaylistedTrackWithLyricsData } from './PlaylistedTrackWithLyricsData.ts'
import { IAudioMetadata } from 'music-metadata-browser'

export type PlaylistedTrackWithMetadata = PlaylistedTrackWithLyricsData & {
	metadata: IAudioMetadata
}