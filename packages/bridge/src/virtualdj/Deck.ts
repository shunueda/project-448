export enum Deck {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center'
}

export function getDeckFromCrossfader(crossfader: number): Deck {
  if (crossfader === 0.5) {
    return Deck.CENTER
  }
  return crossfader < 0.5 ? Deck.LEFT : Deck.RIGHT
}
