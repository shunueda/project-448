export interface VdjState {
  leftDeck: DeckState
  rightDeck: DeckState
  crossfader: number
}

export interface DeckState {
  filepath: string
  position: number
}
