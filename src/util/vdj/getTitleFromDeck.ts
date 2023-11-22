import runScript from './runScript.ts'
import Deck from './Deck.ts'

export default async function getTitleFromDeck(deck: Deck): Promise<string> {
	return runScript(`deck ${deck + 1} get_title`)
}