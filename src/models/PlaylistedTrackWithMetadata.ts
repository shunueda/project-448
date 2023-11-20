import type { PlaylistedTrack, User } from '@spotify/web-api-ts-sdk'
import type LyricsData from './LyricsData.ts'

export type PlaylistedTrackWithMetadata = PlaylistedTrack & {
	lyricsData: LyricsData
	addedUser: User
}
