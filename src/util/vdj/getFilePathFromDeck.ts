import runScript from './runScript.ts'
import Deck from './Deck.ts'

export default async function getFilePathFromDeck(deck: Deck) {
	return runScript(`deck ${deck + 1} get_filepath`)
}
