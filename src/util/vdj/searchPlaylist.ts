import getAllPlaylistItems from '../spotify/getAllPlaylistItems.ts'
import { PlaylistedTrackWithLyricsData } from '../../models/PlaylistedTrackWithLyricsData.ts'
import fetchLyrics from '../spotify/fetchSpotifyLyrics.ts'
import spotifyClient from '../spotify/spotifyClient.ts'

const playlistedTracks = await getAllPlaylistItems(
	import.meta.env.VITE_PLAYLIST_ID
)

const cache = new Map<string, PlaylistedTrackWithLyricsData>()

export default async function searchPlaylist(
	id: string
): Promise<PlaylistedTrackWithLyricsData | undefined> {
	if (cache.has(id)) {
		return cache.get(id)
	}
	const playlistedTrack = playlistedTracks.find(track => track.track.id === id)
	if (playlistedTrack) {
		const playlistedTrackWithLyricsData = {
			...playlistedTrack,
			lyricsData: await fetchLyrics(playlistedTrack.track.id),
			addedUser: await spotifyClient.users.profile(playlistedTrack.added_by.id)
		}
		cache.set(id, playlistedTrackWithLyricsData)
		return playlistedTrackWithLyricsData
	}
	return
}
