import { Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import type { PlaylistedTrackWithMetadata } from '../scripts/models/PlaylistedTrackWithMetadata'
import { useEffect, useRef, useState } from 'react'
import { Animated, Move } from 'remotion-animated'
import Animation from 'remotion-animated/dist/animations/Animation'

interface Props {
	playlistedTrackWithLyrics: PlaylistedTrackWithMetadata
	fontFamily: string
}

interface LineData {
	timestamp: number
	linesCount: number
}

export default function LyricsDisplay({
	playlistedTrackWithLyrics,
	fontFamily
}: Props) {
	const lineHeight = 2.3
	const mainWidth = 16
	const ref = useRef<HTMLDivElement>(null)
	const [animations, setAnimations] = useState<Animation[]>([])
	const frame = useCurrentFrame()
	const videoConfig = useVideoConfig()
	const playbackTimeInMs = Math.round((frame / videoConfig.fps) * 1000)
	const lyrics = playlistedTrackWithLyrics.lyricsData.lyrics.lines
	let currentLyricsLineIndex = -1
	for (let i = 0; i < lyrics.length; i++) {
		if (playbackTimeInMs >= parseInt(lyrics[i].startTimeMs, 10)) {
			currentLyricsLineIndex = i
		} else {
			break
		}
	}
	useEffect(() => {
		ref.current!.innerText = 'PLACEHOLDER'
		const divHeight = ref.current!.clientHeight
		const lineData = lyrics.map(it => {
			ref.current!.innerText = it.words
			const style = window.getComputedStyle(ref.current!)
			const divHeight = ref.current!.clientHeight
			return {
				timestamp: (parseInt(it.startTimeMs, 10) / 1000) * videoConfig.fps,
				linesCount: Math.round(divHeight / parseInt(style.lineHeight, 10))
			} as LineData
		})
		let differed = 0
		const animation = lineData.map(it => {
			const option = {
				y: -(differed + 1) * divHeight,
				start: it.timestamp
			}
			differed = Math.abs(1 - it.linesCount)
			return option
		})
		setAnimations(animation.map(option => Move(option)))
	}, [])

	return (
		<>
			<Audio
				src={staticFile(`audio/${playlistedTrackWithLyrics.track.id}.mp3`)}
			/>
			<Animated
				style={{
					marginTop: `${videoConfig.height / 2}px`,
					overflowY: 'hidden',
					color: '#bbbbbb',
					lineHeight: `${lineHeight}em`,
					fontSize: '3.2em',
					fontFamily,
					fontWeight: 700,
					width: `${mainWidth}em`
				}}
				animations={animations}
			>
				<div>
					{playlistedTrackWithLyrics.lyricsData.lyrics.lines.map((it, i) => (
						<p
							key={i}
							style={{
								margin: 0,
								color: i === currentLyricsLineIndex ? '#ffffff' : '#464646'
							}}
						>
							{it.words}
						</p>
					))}
				</div>
			</Animated>
			<div
				ref={ref}
				style={{
					lineHeight: `${lineHeight}em`,
					fontSize: '3.2em',
					fontFamily,
					fontWeight: 700,
					position: 'absolute',
					width: `${mainWidth}em`,
					visibility: 'hidden'
				}}
			/>
		</>
	)
}
