'use client'
import { Realtime } from 'ably'
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'
import {
  Channel,
  Event,
  type LyricsNotification,
  type TrackNotification
} from 'model'
import { nanoid } from 'nanoid'
import { useEffect, useRef, useState } from 'react'
import useAsyncEffect from 'use-async-effect'
import { Drawer } from 'vaul'
import { Dragger } from '../components/Dragger'
import { Island } from '../components/Island'
import { Lyrics } from '../components/Lyrics'
import styles from './page.module.scss'

export default function Home() {
  const lyricsHeighRatio = 0.85
  const root = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [lyrics, setlyrics] = useState<LyricsNotification>()
  const [track, setTrack] = useState<TrackNotification>()
  useAsyncEffect(async () => {
    if (root.current) {
      disableBodyScroll(root.current)
    }
    setHeight(window.innerHeight)
    const ably = new Realtime({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY as string,
      clientId: nanoid()
    })
    const channel = ably.channels.get(Channel.MAIN)
    await channel.subscribe(Event.LYRICS, notification => {
      setlyrics(notification.data as LyricsNotification)
    })
    await channel.subscribe(Event.TRACK, notification => {
      setTrack(notification.data as TrackNotification)
    })
    await channel.presence.enter()
    return () => {
      ably.close()
      clearAllBodyScrollLocks()
    }
  }, [])
  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      onClose={() => setIsOpen(false)}
    >
      <main ref={root} className={styles.root} style={{ height }}>
        <section
          className={styles.lyrics}
          style={{
            height: height * lyricsHeighRatio
          }}
        >
          {lyrics && <Lyrics notification={lyrics} />}
        </section>
        <section
          className={styles.island}
          style={{
            marginTop: isOpen ? height * (1 - lyricsHeighRatio) : 0,
            height: height * (1 - lyricsHeighRatio)
          }}
        >
          {track && <Island notification={track} setIsOpen={setIsOpen} />}
        </section>
      </main>
      <Drawer.Portal>
        <Drawer.Content className={styles.drawer}>
          {track && <Dragger track={track} />}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
