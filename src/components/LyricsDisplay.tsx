import { useRef, useState } from 'react'
import { PlaylistedTrackWithMetadata } from '../models/PlaylistedTrackWithMetadata.ts'
import Deck from '../util/vdj/Deck.ts'
import useAsyncEffect from 'use-async-effect'
import getFilePathFromDeck from '../util/vdj/getFilePathFromDeck.ts'
import getPlaybackPosition from '../util/vdj/getPlaybackPosition.ts'
import { fetchFromUrl } from 'music-metadata-browser'
import searchPlaylist from '../util/vdj/searchPlaylist.ts'
import styles from './LyricsDisplay.module.scss'
import getCurrentDeck from '../util/vdj/getCurrentDeck.ts'

export default function LyricsDisplay() {
	const [currentPlaylistedTrack, setCurrentPlaylistedTrack] = useState<
		PlaylistedTrackWithMetadata | undefined
	>()
	const [deck, setDeck] = useState<Deck>(Deck.RIGHT)
	const [currentMillisecond, setCurrentMillisecond] = useState(0)
	const [titles, setTitles] = useState(['', ''])
	const [currentLine, setCurrentLine] = useState(0)
	const positionCheckInterval = useRef<NodeJS.Timeout>()
	const deckCheckInterval = useRef<NodeJS.Timeout>()
	const lyricsSectionRef = useRef<HTMLDivElement>(null)
	useAsyncEffect(async () => {
		if (deckCheckInterval.current) {
			clearInterval(deckCheckInterval.current)
		}
		deckCheckInterval.current = setInterval(async () => {
			setDeck(await getCurrentDeck())
			setTitles([
				await getFilePathFromDeck(Deck.LEFT),
				await getFilePathFromDeck(Deck.RIGHT)
			])
		}, 50)
		return () => {
			if (deckCheckInterval.current) {
				clearInterval(deckCheckInterval.current)
			}
		}
	}, [])
	useAsyncEffect(async () => {
		if (positionCheckInterval.current) {
			clearInterval(positionCheckInterval.current)
		}
		positionCheckInterval.current = setInterval(async () => {
			const playbackPosition = await getPlaybackPosition(deck)
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
	}, [deck])
	useAsyncEffect(async () => {
		const filepath = await getFilePathFromDeck(deck)
		const publicFileName = filepath.substring(
			filepath.lastIndexOf('/public') + '/public'.length
		)
		const metadata = await fetchFromUrl(publicFileName)
		const trackId = metadata.common.comment![0]
		const playlistedTrack = await searchPlaylist(trackId)
		setCurrentPlaylistedTrack(playlistedTrack)
	}, [...titles, deck])
	useAsyncEffect(async () => {
		let offset = 0
		for (let i = 0; i < currentLine; i++) {
			const line = document.getElementById(`line-${i}`)
			if (line) {
				offset += line.offsetHeight
			}
		}
		lyricsSectionRef.current!.style.marginTop = `-${offset}px`
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
