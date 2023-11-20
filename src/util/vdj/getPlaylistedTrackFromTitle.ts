import getAllPlaylistItems from '../spotify/getAllPlaylistItems.ts'
import { PlaylistedTrackWithMetadata } from '../../models/PlaylistedTrackWithMetadata.ts'
import fetchLyrics from '../spotify/fetchSpotifyLyrics.ts'
import spotifyClient from '../spotify/spotifyClient.ts'

const playlistedTracks = await getAllPlaylistItems(
	import.meta.env.VITE_PLAYLIST_ID
)

console.log(playlistedTracks)

const cache = new Map<string, PlaylistedTrackWithMetadata>()

export default async function getPlaylistedTrackFromTitle(
	title: string
): Promise<PlaylistedTrackWithMetadata | undefined> {
	if (cache.has(title)) {
		return cache.get(title)
	}
	const playlistedTrack = playlistedTracks.find(
		track => track.track.name === title
	)
	if (playlistedTrack) {
		const playlistedTrackWithMetadata = {
			...playlistedTrack,
			lyricsData: await fetchLyrics(playlistedTrack.track.id),
			addedUser: await spotifyClient.users.profile(playlistedTrack.added_by.id)
		}
		cache.set(title, playlistedTrackWithMetadata)
		return playlistedTrackWithMetadata
	}
	return
}
