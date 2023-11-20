import fetchJson from '../fetchJson.ts'
import { PlaylistedTrackWithMetadata } from '../../models/PlaylistedTrackWithMetadata.ts'

export default async function getPlaylistedTrackFromTitle(title: string) {
	return await fetchJson<PlaylistedTrackWithMetadata>(
		`http://localhost:2000/spotify/track/${title}`
	)
}
