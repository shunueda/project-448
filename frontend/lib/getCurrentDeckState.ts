import getCurrentDeck from 'lib/getCurrentDeck'
import Deck from 'lib/models/Deck'
import VDJState, { DeckState } from 'lib/models/VDJState'

export default function getCurrentDeckState(state: VDJState): DeckState {
  const currentDeck = getCurrentDeck(state)
  if (currentDeck == Deck.LEFT) {
    return state.leftDeck
  } else {
    return state.rightDeck
  }
}
