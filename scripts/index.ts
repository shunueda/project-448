import 'dotenv/config'
import { $ } from 'execa'
import { Listr, ListrLogger, ListrLogLevels } from 'listr2'
import getAllPlaylistItems from './util/getAllPlaylistItems'
import type { AsyncReturnType } from './util/types'
import spotifyClient from './SpotifyClient'
import { readdir } from 'fs/promises'
import { writeFileSync } from 'fs'
import mkdir from 'make-dir'
import { PlaylistedTrackWithMetadata } from './models/PlaylistedTrackWithMetadata'
import fetchLyrics from './fetchSpotifyLyrics'

const playlistId = process.env.PLAYLIST_ID as string

interface Ctx<T> {
	value: T
}

const logger = new ListrLogger({ useIcons: true })
logger.log(ListrLogLevels.STARTED, 'Build started!')

await new Listr<Ctx<AsyncReturnType<typeof getAllPlaylistItems>>>(
	[
		{
			title: 'Downloading audio',
			task: async () => {
				return $`spotdl download https://open.spotify.com/playlist/${playlistId} --output public/audio/{track-id} --audio youtube-music`
					.stdout
			}
		},
		{
			title: 'Retrieving playlist tracks',
			task: async (
				ctx: Ctx<AsyncReturnType<typeof getAllPlaylistItems>>,
				task
			) => {
				const tracks = await getAllPlaylistItems(playlistId)
				ctx.value = tracks
				task.title = `Retrieved ${tracks.length} tracks`
			}
		},
		{
			title: 'Creating Props file (cache)',
			task: async (ctx, task) => {
				const users = (
					await Promise.all(
						[...new Set(ctx.value.map(plTrack => plTrack.added_by.id))].map(
							id => spotifyClient.users.profile(id)
						)
					)
				).reduce((acc, user) => acc.set(user.id, user), new Map())
				await mkdir('out/props')
				const existingProps = await readdir('out/props')
				const tasks = await Promise.all(
					ctx.value
						.filter(({ track }) => !existingProps.includes(track.id))
						.map(async plTrack => {
							try {
								const lyricsData = await fetchLyrics(plTrack.track.id)
								return {
									title: plTrack.track.name,
									task: async () => {
										const prop: PlaylistedTrackWithMetadata = {
											...plTrack,
											lyricsData,
											// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
											addedUser: users.get(plTrack.added_by.id)!
										}
										writeFileSync(
											`out/props/${plTrack.track.id}`,
											JSON.stringify(prop)
										)
									}
								}
							} catch (e) {
								return {
									title: `Lyric fetch for ${plTrack.track.name} failed`,
									// eslint-disable-next-line @typescript-eslint/no-empty-function
									task: () => {}
								}
							}
						})
				)
				return task.newListr(() => tasks, {
					concurrent: true
				})
			}
		}
	],
	{
		concurrent: false,
		rendererOptions: {
			collapseSubtasks: false
		}
	}
).run()
