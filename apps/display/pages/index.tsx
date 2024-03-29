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
    ably.publish(AblyEvent.JOIN, {}).then()
    ably
      .subscribe(AblyEvent.DISPLAY_UPDATE, async notification => {
        handleDisplayUpdateNotification(
          notification.data as DisplayUpdateNotification
        )
      })
      .then()
    return () => {
      ably.unsubscribe(AblyEvent.DISPLAY_UPDATE)
    }
  }, [])

  function handleDisplayUpdateNotification(
    displayUpdateNotificaiton: DisplayUpdateNotification
  ) {
    setLines(displayUpdateNotificaiton.lines)
    setSimpleTrackInfo(displayUpdateNotificaiton.trackInfo)
  }

  return (
    <main className={styles.main} ref={mainRef}>
      {/*<div className={styles.topbar}>Topbar</div>*/}
      <div className={styles.lyricsArea}>
        {lines.map((line, i) => (
          <div className={styles.shelf}>
            <p
              className={styles.line}
              style={{
                opacity: i === Math.floor(lines.length / 2) ? 1 : 0.5
              }}
            >
              {line}
            </p>
          </div>
        ))}
      </div>
      <div className={styles.trackInfoArea}>
        <div
          className={styles.coverArt}
          style={{
            backgroundImage: `url(${simpleTrackInfo?.coverArtUrl || ''})`
          }}
        />
        <div className={styles.textarea}>
          <p className={styles.musicTitle}>{simpleTrackInfo?.title}</p>
          <p className={styles.musicArtist}>
            {simpleTrackInfo?.artist} - {simpleTrackInfo?.album}
          </p>
        </div>
      </div>
    </main>
  )
}
