import type { SubscriptionData } from './virtualdj/SubscriptionData'
import { Triggers } from './virtualdj/Triggers'

export function handleSubscriptionData(data: SubscriptionData) {
  switch (data.trigger) {
    case Triggers.CROSSFADER: {
      const value = data.value as number
      break
    }
    case Triggers.DECK_1_FILENAME: {
      const value = data.value as string
      break
    }
    case Triggers.DECK_2_FILENAME: {
      const value = data.value as string
      break
    }
    case Triggers.DECK_1_ELAPSED_TIME: {
      const value = data.value as number
      break
    }
    case Triggers.DECK_2_ELAPSED_TIME: {
      const value = data.value as number
      break
    }
  }
}
