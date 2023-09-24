import type { PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import type LyricsData from './LyricsData'

export type PlaylistedTrackWithLyrics = PlaylistedTrack & {
	lyricsData: LyricsData
}
