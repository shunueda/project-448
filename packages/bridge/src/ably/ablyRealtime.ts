import { Realtime } from 'ably'

export const ablyRealtime = new Realtime(process.env.ABLY_API_KEY)
