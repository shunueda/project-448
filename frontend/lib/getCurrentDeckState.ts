import VDJState, { DeckState } from '@/lib/models/VDJState'
import getCurrentDeck from '@/lib/getCurrentDeck'
import Deck from '@/lib/Deck'

export default function getCurrentDeckState(state: VDJState): DeckState {
  const currentDeck = getCurrentDeck(state)
  if (currentDeck == Deck.LEFT) {
    return state.leftDeck
  } else {
    return state.rightDeck
  }
}
