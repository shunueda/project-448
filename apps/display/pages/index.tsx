'use client'
import Ably from 'ably'
import { AblyProvider } from 'ably/react'
import dynamic from 'next/dynamic'

const LyricsDisplay = dynamic(() => import('../components/LyricsDisplay'), {
  ssr: false
})

export default function Home() {
  const client = new Ably.Realtime({ authUrl: '/api/ably-auth/' })
  return (
    <AblyProvider client={client}>
      <LyricsDisplay />
    </AblyProvider>
  )
}
