import type { DeckState, VdjState } from 'models'

export default function getCurrentDeckState(vdjState: VdjState): DeckState {
  return vdjState.crossfader > 0.5 ? vdjState.rightDeck : vdjState.leftDeck
}
