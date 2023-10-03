import 'dotenv/config'
import getAllPlaylistItems from '../util/getAllPlaylistItems'
import { readdir } from 'fs/promises'
import { parseFile } from 'music-metadata'
import mkdir from 'make-dir'

await mkdir('out/temp')
const renderedIds = (
	await Promise.all(
		(await readdir('out/temp')).map(async file => {
			if (file.endsWith('.mp4')) {
				const metadata = (await parseFile(`out/temp/${file}`)).common.comment
				if (metadata && metadata.length) {
					return metadata[0]
				}
			}
		})
	)
).filter(Boolean) as string[]

console.log(
	(await getAllPlaylistItems(process.env.PLAYLIST_ID as string))
		.filter(it => !renderedIds.includes(it.track.id))
		.map(it => it.track.id)
		.join(' ')
)
