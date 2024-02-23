export default interface VDJState {
  leftDeck: DeckState
  rightDeck: DeckState
  crossfader: number
}

export interface DeckState {
  filepath: string
  position: number
}
