import getAllPlaylistItems from '../spotify/getAllPlaylistItems.ts'
import { PlaylistedTrackWithMetadata } from '../../models/PlaylistedTrackWithMetadata.ts'
import fetchLyrics from '../spotify/fetchSpotifyLyrics.ts'
import spotifyClient from '../spotify/spotifyClient.ts'

const playlistedTracks = await getAllPlaylistItems(
	import.meta.env.VITE_PLAYLIST_ID
)

const cache = new Map<string, PlaylistedTrackWithMetadata>()

export default async function searchPlaylist(
	id: string
): Promise<PlaylistedTrackWithMetadata | undefined> {
	if (cache.has(id)) {
		return cache.get(id)
	}
	const playlistedTrack = playlistedTracks.find(track => track.track.id === id)
	if (playlistedTrack) {
		const playlistedTrackWithMetadata = {
			...playlistedTrack,
			lyricsData: await fetchLyrics(playlistedTrack.track.id),
			addedUser: await spotifyClient.users.profile(playlistedTrack.added_by.id)
		}
		cache.set(id, playlistedTrackWithMetadata)
		return playlistedTrackWithMetadata
	}
	return
}
