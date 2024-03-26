import Deck from 'lib/models/Deck'
import VDJState from 'lib/models/VDJState'

export default function getCurrentDeck(state: VDJState) {
  const { crossfader } = state
  return crossfader <= 0.5 ? Deck.LEFT : Deck.RIGHT
}
