import { useContext, useRef, useState } from 'react'
import useAsyncEffect from 'use-async-effect'
import getPlaybackPosition from '../util/vdj/getPlaybackPosition.ts'
import styles from './LyricsDisplay.module.scss'
import { GlobalContext } from '../App.tsx'

export default function LyricsDisplay() {
	const [currentMillisecond, setCurrentMillisecond] = useState(0)
	const [currentLine, setCurrentLine] = useState(0)
	const positionCheckInterval = useRef<NodeJS.Timeout>()
	const lyricsSectionRef = useRef<HTMLDivElement>(null)
	const { currentDeck, currentPlaylistedTrack } = useContext(GlobalContext)
	useAsyncEffect(async () => {
		if (positionCheckInterval.current) {
			clearInterval(positionCheckInterval.current)
		}
		positionCheckInterval.current = setInterval(async () => {
			const playbackPosition = await getPlaybackPosition(currentDeck)
			setCurrentMillisecond(playbackPosition)
			if (currentPlaylistedTrack) {
				const lyricLines = currentPlaylistedTrack.lyricsData.lyrics.lines
				for (let i = 0; i < lyricLines.length; i++) {
					const lyricLine = lyricLines[i]
					if (lyricLine.startTimeMs <= playbackPosition) {
						setCurrentLine(i)
					}
				}
			}
		}, 50)
		return () => {
			if (positionCheckInterval.current) {
				clearInterval(positionCheckInterval.current)
			}
		}
	}, [currentDeck])
	useAsyncEffect(async () => {
		let offset = 0
		for (let i = 0; i < currentLine; i++) {
			const line = document.getElementById(`line-${i}`)
			if (line) {
				offset += line.offsetHeight
			}
		}
		lyricsSectionRef.current!.style.marginTop = `calc(-${offset}px + 50%)`
	}, [currentLine])
	return (
		<div className={styles.lyricsDisplay}>
			<div className={styles.lyricsSection} ref={lyricsSectionRef}>
				{currentPlaylistedTrack?.lyricsData.lyrics.lines.map((line, i) => {
					return (
						<p
							style={{
								color: line.startTimeMs <= currentMillisecond ? 'red' : 'black'
							}}
							className={styles.line}
							id={`line-${i}`}
						>
							{line.words}
						</p>
					)
				})}
			</div>
		</div>
	)
}
