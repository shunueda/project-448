enum Deck {
  LEFT = 1,
  RIGHT = 2
}

export function getOtherIndex(deck: Deck) {
  return deck === Deck.LEFT ? 2 : 1
}

export default Deck