import type { Deck } from './Deck'

export interface DeckState {
  left: SingleDeckState
  right: SingleDeckState
  deck: Deck
}

export interface SingleDeckState {
  id: string
  position: number
}
