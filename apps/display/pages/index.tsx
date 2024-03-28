import { disableBodyScroll } from 'body-scroll-lock'
import {
  AblyChannel,
  AblyEvent,
  DisplayUpdateNotification,
  SimpleTrackInfo
} from 'models'
import { useEffect, useRef, useState } from 'react'
import ablyClient from '../lib/ablyClient'
import styles from '../styles/index.module.scss'

export default function Home() {
  const ably = ablyClient.channels.get(AblyChannel.MAIN)
  const [lines, setLines] = useState<string[]>([])
  const [simpleTrackInfo, setSimpleTrackInfo] = useState<SimpleTrackInfo>()
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    disableBodyScroll(mainRef.current as HTMLElement)
    ably
      .subscribe(AblyEvent.DISPLAY_UPDATE, async notification => {
        console.log(notification.data)
        handleDisplayUpdateNotification(
          notification.data as DisplayUpdateNotification
        )
      })
      .then()
  }, [])

  function handleDisplayUpdateNotification(
    displayUpdateNotificaiton: DisplayUpdateNotification
  ) {
    setLines(displayUpdateNotificaiton.lines)
    setSimpleTrackInfo(displayUpdateNotificaiton.trackInfo)
  }

  return (
    <main className={styles.main} ref={mainRef}>
      <div className={styles.trackInfoArea}>
        <img
          src={`data:image/jpeg;base64,${simpleTrackInfo?.cover || ''}`}
          alt='Red dot'
        />
        {/*<h1>{simpleTrackInfo?.title}</h1>*/}
        {/*<h2>*/}
        {/*  {simpleTrackInfo?.artist} - {simpleTrackInfo?.album}*/}
        {/*</h2>*/}
      </div>
      <div className={styles.lyricsArea}>
        {lines.map(line => (
          <div className={styles.shelf}>
            <p className={styles.line}>{line}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
