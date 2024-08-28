import type { Triggers } from './Triggers'

export interface SubscriptionData {
  evt: 'subscribed'
  trigger: Triggers
  value: unknown
}
