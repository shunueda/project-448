import type { Event } from '../os2l/Event'
import type { Trigger } from './Trigger'

export interface SubscriptionData {
  evt: Event.SUBSCRIBED
  trigger: Trigger
  value: unknown
}
