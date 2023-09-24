import { type Ref, useEffect, useRef, useState } from 'react'
import type { PlaylistedTrackWithLyrics } from '../scripts/models/PlaylistedTrackWithLyrics'
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'

interface Props {
	playlistedTrackWithLyrics: PlaylistedTrackWithLyrics
	fontFamily: string
}

export default function LyricsDisplay({
	playlistedTrackWithLyrics,
	fontFamily
}: Props) {
	const [
		currentLyricsLineIndexWithMultipleOffset,
		setCurrentLyricsLineIndexWithMultipleOffset
	] = useState(-1)
	const [differedOffset, setDifferedOffset] = useState(0)
	const currentBlockRef = useRef<HTMLDivElement>(null)

	const lineHeight = 6.25

	const trackId = playlistedTrackWithLyrics.track.id
	const lyrics = playlistedTrackWithLyrics.lyricsData.lyrics.lines
	const frame = useCurrentFrame()
	const { fps } = useVideoConfig()
	const playbackTimeInMs = Math.round((frame / fps) * 1000)
	let currentLyricsLineIndex = -1
	for (let i = 0; i < lyrics.length; i++) {
		if (playbackTimeInMs >= parseInt(lyrics[i].startTimeMs, 10)) {
			currentLyricsLineIndex = i
		} else {
			break
		}
	}
	useEffect(() => {
		if (currentBlockRef.current) {
			const divHeight = currentBlockRef.current.clientHeight
			const style = window.getComputedStyle(currentBlockRef.current)
			const lineHeight = parseInt(style.lineHeight, 10)
			const count = divHeight / lineHeight
			const differedOffsetTemp = Math.round(count) - 1
			setCurrentLyricsLineIndexWithMultipleOffset(
				curr => curr + 1 + differedOffset
			)
			setDifferedOffset(differedOffsetTemp)
		}
	}, [currentLyricsLineIndex])
	return (
		<>
			<Audio src={staticFile(`audio/${trackId}.mp3`)} />
			<div
				style={{
					fontFamily,
					overflowY: 'hidden',
					padding: '3em',
					lineHeight: `${lineHeight}em`,
					marginTop: `calc(40% - ${lineHeight}em - ${
						currentLyricsLineIndexWithMultipleOffset * lineHeight
					}em)`
				}}
			>
				{lyrics.map((line, i) => {
					return (
						<Block
							lineNumber={i}
							currentLineNumber={currentLyricsLineIndex}
							refIfHighlighted={currentBlockRef}
						>
							{line.words}
						</Block>
					)
				})}
			</div>
		</>
	)
}

interface BlockProps {
	children: string
	lineNumber: number
	currentLineNumber: number
	refIfHighlighted?: Ref<HTMLDivElement>
}

export function Block({
	lineNumber,
	currentLineNumber,
	refIfHighlighted,
	children
}: BlockProps) {
	return (
		<div
			ref={lineNumber === currentLineNumber ? refIfHighlighted : undefined}
			style={{
				textAlign: 'left',
				fontWeight: 'bold',
				fontSize: '2.5em',
				color:
					lineNumber > currentLineNumber
						? '#525252'
						: lineNumber < currentLineNumber
						? '#8f8f8f'
						: '#e8e8e8'
			}}
		>
			{children}
		</div>
	)
}
