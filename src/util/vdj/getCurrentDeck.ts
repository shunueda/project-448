import Deck from './Deck.ts'
import runScript from './runScript.ts'

export default async function getCurrentDeck() {
	const crossfader = parseFloat(await runScript('crossfader'))
	return crossfader < 0.5 ? Deck.LEFT : Deck.RIGHT
}
