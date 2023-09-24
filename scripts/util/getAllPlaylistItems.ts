import spotifyClient from '../SpotifyClient'
import { PlaylistedTrack } from '@spotify/web-api-ts-sdk'

export default async function getAllPlaylistItems(playlistId: string) {
	const limit = 50
	let offset = 0
	let allTracks: PlaylistedTrack[] = []
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const response = await spotifyClient.playlists.getPlaylistItems(
			playlistId,
			undefined,
			undefined,
			limit,
			offset
		)
		allTracks = allTracks.concat(response.items)
		if (response.items.length < limit) {
			break
		}
		offset += limit
	}

	return allTracks
}
