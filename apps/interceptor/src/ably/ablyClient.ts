import { Realtime } from 'ably'

const ablyClient = new Realtime({ key: process.env.ABLY_API_KEY })

export default ablyClient
