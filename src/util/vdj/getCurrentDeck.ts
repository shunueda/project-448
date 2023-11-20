import Deck from './Deck.ts'
import runScript from './runScript.ts'
import getTrackTitle from './getTrackTitle.ts'

export default async function getCurrentDeck() {
	const crossfader = parseFloat(await runScript('crossfader'))
	const currentDeck = crossfader < 0.5 ? Deck.LEFT : Deck.RIGHT
	if (!(await getTrackTitle(currentDeck))) {
		return currentDeck === Deck.LEFT ? Deck.RIGHT : Deck.LEFT
	}
	return currentDeck
}
