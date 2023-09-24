import { execSync } from 'child_process'
import { mkdir, readFile, writeFile } from 'fs/promises'
import 'dotenv/config'
import fetchLyrics from './fetchSpotifyLyrics'
import spotifyClient from './SpotifyClient'
import type { PlaylistedTrackWithLyrics } from './models/PlaylistedTrackWithLyrics'
import type { User } from '@spotify/web-api-ts-sdk'
import { existsSync } from 'fs'
import getAllPlaylistItems from './util/getAllPlaylistItems'

for (const dir of ['public/audio', 'trackInfo']) {
	if (!existsSync(dir)) {
		await mkdir(dir)
	}
}

const playlistId = process.env.PLAYLIST_ID as string

console.log('Downloading audio...')
console.log(
	execSync(
		`spotdl download https://open.spotify.com/playlist/${playlistId} --output public/audio/{track-id} --audio youtube-music`
	).toString()
)
console.log('Download done!')

const tracks = await getAllPlaylistItems(playlistId)

const usersFile = 'public/users.json'
await writeFile(usersFile, '[]')
const users = JSON.parse(await readFile(usersFile, 'utf-8')) as User[]

for (const plTrack of tracks) {
	if (existsSync(`trackInfo/${plTrack.track.id}.json`)) {
		console.log(`Skipping ${plTrack.track.name} (id: ${plTrack.track.id})`)
		continue
	}
	try {
		const lyricInfo = await fetchLyrics(plTrack.track.id)
		const data: PlaylistedTrackWithLyrics = {
			...plTrack,
			lyricsData: lyricInfo
		}
		if (!users.find(u => u.id === plTrack.added_by.id)) {
			users.push(await spotifyClient.users.profile(plTrack.added_by.id))
		}
		await writeFile(`trackInfo/${plTrack.track.id}.json`, JSON.stringify(data))
	} catch (_) {
		console.log(
			`Failed to fetch lyrics for ${plTrack.track.name} (id: ${plTrack.track.id}))`
		)
	}
}
await writeFile(usersFile, JSON.stringify(users))
