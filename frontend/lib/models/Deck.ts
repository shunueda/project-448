enum Deck {
  LEFT = 1,
  RIGHT = 2
}

export function getOpposite(deck: Deck): Deck {
  return deck === Deck.LEFT ? Deck.RIGHT : Deck.LEFT
}

export default Deck
