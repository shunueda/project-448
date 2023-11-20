import useAsyncEffect from 'use-async-effect'
import { PlaylistedTrackWithMetadata } from './models/PlaylistedTrackWithMetadata.ts'
import { useState } from 'react'
import getCurrentDeck from './util/vdj/getCurrentDeck.ts'
import getTrackTitle from './util/vdj/getTrackTitle.ts'
import getPlaylistedTrackFromTitle from './util/vdj/getPlaylistedTrackFromTitle.ts'
import runScript from './util/vdj/runScript.ts'

function App() {
	// const [currentPlaylistedTrack, setCurrentPlaylistedTrack] =
	// 	useState<PlaylistedTrackWithMetadata | null>(null)
	useAsyncEffect(async () => {
		// const deck = await getCurrentDeck()
		// const trackTitle = await getTrackTitle(deck)
		// console.log(await getPlaylistedTrackFromTitle(trackTitle))
		console.log(await runScript('deck 1 get_filepath'))
	}, [])
	return <></>
}

export default App
