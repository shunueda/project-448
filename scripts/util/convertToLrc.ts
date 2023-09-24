import type LyricsData from '../models/LyricsData'

export default function convertToLrc(data: LyricsData) {
	const { lyrics } = data
	let lrcContent = '[ar:' + lyrics.providerDisplayName + ']\n'
	lrcContent += '[al:' + lyrics.provider + ']\n'
	lyrics.lines.forEach(line => {
		const lrcTime = msToLrcTime(line.startTimeMs)
		lrcContent += lrcTime + line.words + '\n'
	})

	return lrcContent
}

function msToLrcTime(ms: string) {
	const milliseconds = parseInt(ms, 10)
	const totalSeconds = Math.floor(milliseconds / 1000)
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60
	const centiseconds = Math.floor((milliseconds % 1000) / 10)
	return `[${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
		2,
		'0'
	)}.${String(centiseconds).padStart(2, '0')}]`
}
