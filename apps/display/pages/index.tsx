import { Realtime } from 'ably'
import { disableBodyScroll } from 'body-scroll-lock'
import { AblyChannel, AblyEvent, DisplayUpdateNotification } from 'models'
import { useEffect, useRef, useState } from 'react'
import useAsyncEffect from 'use-async-effect'
import { Drawer } from 'vaul'
import Island from '../components/Island'
import LyricsDisplay from '../components/LyricsDisplay'
import Player from '../components/Player'
import styles from './index.module.scss'

export default function Home() {
  const ref = useRef<HTMLDivElement>(null)
  const [notification, setNotification] = useState<DisplayUpdateNotification>()
  const [playerOpen, setPlayerOpen] = useState(false)
  useAsyncEffect(async () => {
    const ably = new Realtime(process.env.NEXT_PUBLIC_ABLY_API_KEY)
    const channel = ably.channels.get(AblyChannel.MAIN)
    await channel.subscribe(AblyEvent.DISPLAY_UPDATE, notification => {
      setNotification(notification.data as DisplayUpdateNotification)
    })
    await channel.publish(AblyEvent.JOIN, {})
    return () => {
      ably.close()
    }
  }, [])
  useEffect(() => {
    if (ref.current) {
      disableBodyScroll(ref.current as HTMLElement)
    }
  }, [notification?.trackInfo?.title])
  if (!notification) {
    return <></>
  }
  return (
    <main className={styles.root} ref={ref}>
      <LyricsDisplay notification={notification} />
      <Island
        simpleTrackInfo={notification.trackInfo}
        playerOpen={playerOpen}
        setPlayerOpen={setPlayerOpen}
      />
      <Drawer.Root open={playerOpen} onClose={() => setPlayerOpen(false)}>
        <Player notification={notification} />
      </Drawer.Root>
    </main>
  )
}
