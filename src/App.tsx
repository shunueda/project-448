import useAsyncEffect from 'use-async-effect'
import { useState } from 'react'
import { PlaylistedTrackWithMetadata } from './models/PlaylistedTrackWithMetadata.ts'
import getCurrentDeck from './util/vdj/getCurrentDeck.ts'
import getTrackTitle from './util/vdj/getTrackTitle.ts'
import getPlaylistedTrackFromTitle from './util/vdj/getPlaylistedTrackFromTitle.ts'
import { fetchFromUrl } from 'music-metadata-browser'

function App() {
	const [currentPlaylistedTrack, setCurrentPlaylistedTrack] = useState<
		PlaylistedTrackWithMetadata | undefined
	>()
	useAsyncEffect(async () => {
		const deck = await getCurrentDeck()
		const title = await getTrackTitle(deck)
		setCurrentPlaylistedTrack(await getPlaylistedTrackFromTitle(title))
		console.log(await fetchFromUrl('/TWICE - The Feels.mp3'))
	}, [])
	return (
		<>
			<h2>Current:</h2>
			<p>{currentPlaylistedTrack}</p>
		</>
	)
}

export default App
