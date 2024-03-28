import { DeckState, VdjState } from 'models/src/vdj/VdjState'

export default function getCurrentDeckState(vdjState: VdjState): DeckState {
  return vdjState.crossfader >= 0.5 ? vdjState.rightDeck : vdjState.leftDeck
}
