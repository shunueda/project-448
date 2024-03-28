import Config from 'config'
import type { VdjState } from 'models'
import { VdjStateChangeEvent, type VdjEventNotification } from 'models'

function hasSignificantPositionChange(
  previousPosition: number,
  currentPosition: number,
  tolerance: number,
  expectedChangeDueToPlay: number
): boolean {
  const positionDifference = Math.abs(currentPosition - previousPosition)
  return positionDifference > tolerance + expectedChangeDueToPlay
}

export default function createNotifications(
  previousState: VdjState | undefined,
  currentState: VdjState,
  tolerance: number
): VdjEventNotification[] {
  if (!previousState) return []
  const events: VdjEventNotification[] = []
  // Track loading
  if (previousState.leftDeck.filepath !== currentState.leftDeck.filepath) {
    events.push({
      event: VdjStateChangeEvent.NEW_TRACK_LOADED_LEFT_DECK,
      deckState: currentState.leftDeck
    })
  }
  if (previousState.rightDeck.filepath !== currentState.rightDeck.filepath) {
    events.push({
      event: VdjStateChangeEvent.NEW_TRACK_LOADED_RIGHT_DECK,
      deckState: currentState.rightDeck
    })
  }

  // Crossfader changes determining main deck
  if (previousState.crossfader <= 0.5 && currentState.crossfader > 0.5) {
    events.push({
      event: VdjStateChangeEvent.MAIN_DECK_CHANGE_TO_RIGHT,
      deckState: currentState.rightDeck
    })
  } else if (previousState.crossfader > 0.5 && currentState.crossfader <= 0.5) {
    events.push({
      event: VdjStateChangeEvent.MAIN_DECK_CHANGE_TO_LEFT,
      deckState: currentState.leftDeck
    })
  }

  // Position change in the main deck
  const mainDeckKey = currentState.crossfader > 0.5 ? 'rightDeck' : 'leftDeck'
  const previousMainDeck = previousState[mainDeckKey]
  const currentMainDeck = currentState[mainDeckKey]
  const expectedChangeDueToPlay = Config.interceptor_interval
  if (
    hasSignificantPositionChange(
      previousMainDeck.position,
      currentMainDeck.position,
      tolerance,
      expectedChangeDueToPlay
    )
  ) {
    events.push({
      event: VdjStateChangeEvent.MAIN_DECK_POSITION_CHANGE,
      deckState: currentMainDeck
    })
  }

  return events
}
