import styles from './App.module.scss'
import { createContext, useRef, useState } from 'react'
import { PlaylistedTrackWithMetadata } from './models/PlaylistedTrackWithMetadata.ts'
import useAsyncEffect from 'use-async-effect'
import getCurrentDeck from './util/vdj/getCurrentDeck.ts'
import getFilePathFromDeck from './util/vdj/getFilePathFromDeck.ts'
import Deck from './util/vdj/Deck.ts'
import { fetchFromUrl } from 'music-metadata-browser'
import searchPlaylist from './util/vdj/searchPlaylist.ts'
import { Track } from '@spotify/web-api-ts-sdk'
import LyricsDisplay from './components/LyricsDisplay.tsx'

interface GlobalContext {
	currentPlaylistedTrack: PlaylistedTrackWithMetadata | undefined
	currentDeck: Deck
}

export const GlobalContext = createContext<GlobalContext>({
	currentPlaylistedTrack: undefined,
	currentDeck: Deck.LEFT
})

export default function App() {
	const [deck, setDeck] = useState<Deck>(Deck.LEFT)
	const [titles, setTitles] = useState(['', ''])
	const [currentPlaylistedTrack, setCurrentPlaylistedTrack] = useState<
		PlaylistedTrackWithMetadata | undefined
	>()
	const rootElementRef = useRef(null)
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
		const filepath = await getFilePathFromDeck(deck)
		const publicFileName = filepath.substring(
			filepath.lastIndexOf('/public') + '/public'.length
		)
		const metadata = await fetchFromUrl(publicFileName)
		const trackId = metadata.common.comment![0]
		const playlistedTrack = (await searchPlaylist(trackId))!
		if (playlistedTrack.track.id !== currentPlaylistedTrack?.track.id) {
			setCurrentPlaylistedTrack({
				...playlistedTrack,
				metadata
			})
		}
	}, [...titles, deck])
	const deckCheckInterval = useRef<NodeJS.Timeout>()
	const track = currentPlaylistedTrack?.track as Track
	return currentPlaylistedTrack ? (
		<main className={styles.root}>
			<GlobalContext.Provider
				value={{
					currentPlaylistedTrack: currentPlaylistedTrack,
					currentDeck: deck
				}}
			>
				<div className={styles.left}>
					<div className={styles.albumInfo}>
						<img
							onClick={async () => {
								await (
									document.getElementById('root')! as HTMLDivElement
								).requestFullscreen()
							}}
							src={track.album.images[0].url}
							className={styles.albumArt}
							alt=''
						/>
						<h1>{track.name}</h1>
						<h2>{track.artists.map(artist => artist.name).join(', ')}</h2>
						<h3>
							Added by{' '}
							<span className={styles.addedUser}>
								{currentPlaylistedTrack.addedUser.display_name}
							</span>{' '}
							on:
						</h3>
						<img className={styles.spcode} src='/spcode.svg' alt='' />
					</div>
				</div>
				<div className={styles.right}>
					<div className={styles.lyricsContainer}>
						<LyricsDisplay />
					</div>
				</div>
			</GlobalContext.Provider>
		</main>
	) : (
		<></>
	)
}
