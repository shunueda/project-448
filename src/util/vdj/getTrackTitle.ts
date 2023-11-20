import runScript from './runScript.ts'
import Deck from './Deck.ts'

export default async function getTrackTitle(deck: Deck) {
	return runScript(`deck ${deck + 1} get_title`)
}
