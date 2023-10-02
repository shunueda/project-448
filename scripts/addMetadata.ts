import { exec } from 'child_process'
import { rmSync } from 'fs'

addMetadata(`out/${id}.mp4`, {
	name: props.name,
	title: props.title,
	album: props.album,
	artist: props.artist,
	cover: props.cover
})

function addMetadata(inputFile: string, metadata: Record<string, string>) {
	const outputFile = `out/${metadata.name}.mp4`
	let coverArg = ''
	let mapArgs = '-map 0'
	if (metadata.cover) {
		coverArg = `-i "${metadata.cover}"`
		mapArgs += ' -map 1 -c:v copy -disposition:v:1 attached_pic'
		delete metadata.cover
	}
	const metadataArgs =
		Object.entries(metadata)
			.map(([key, value]) => {
				return `-metadata ${key}="${value}"`
			})
			.join(' ') + ` -metadata comment=`
	const command = `ffmpeg -i "${inputFile}" ${coverArg} ${mapArgs} ${metadataArgs} -c:a copy "${outputFile}" -y`
	exec(command, () => {
		rmSync(inputFile)
		console.log('Metadata and cover image added successfully.')
	})
}
