import { execa } from 'execa'
import { rm } from 'fs/promises'

interface Metadata {
	title: string
	album: string
	artist: string
	cover?: string
}

export default async function addMetadata(id: string, metadata: Metadata) {
	let coverArg: string[] = []
	const mapArgs = ['-map', '0']
	if (metadata.cover) {
		coverArg = ['-i', metadata.cover]
		mapArgs.push(
			'-map',
			'1',
			'-c:v',
			'copy',
			'-disposition:v:1',
			'attached_pic'
		)
		delete metadata.cover
	}
	const metadataArgs = Object.entries(metadata).flatMap(([key, value]) => {
		return ['-metadata', `${key}=${value}`]
	})
	metadataArgs.push('-metadata', `comment=${id}`)
	const inputFile = `out/temp/${id}.mp4`
	await execa('ffmpeg', [
		'-i',
		inputFile,
		...coverArg,
		...mapArgs,
		...metadataArgs,
		'-c:a',
		'copy',
		`out/artifacts/${metadata.title}.mp4`,
		'-y'
	])
	await rm(inputFile)
}
