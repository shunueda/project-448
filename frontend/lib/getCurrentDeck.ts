import VDJState from '@/lib/models/VDJState'
import Deck from '@/lib/Deck'

export default function getCurrentDeck(state: VDJState) {
  const { crossfader } = state
  return crossfader <= 0.5 ? Deck.LEFT : Deck.RIGHT
}