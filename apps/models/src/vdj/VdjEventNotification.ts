import type { DeckState } from './VdjState'
import { VdjStateChangeEvent } from './VdjStateChangeEvent'

export interface VdjEventNotification {
  event: VdjStateChangeEvent
  deckState: DeckState
}
