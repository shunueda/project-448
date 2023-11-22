import Deck from './Deck.ts'
import runScript from './runScript.ts'

export default async function getPlaybackPosition(deck: Deck) {
	return parseInt(await runScript(`deck ${deck + 1} get_time 'elapsed'`))
}
