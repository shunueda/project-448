import { Realtime } from 'ably'
import { disableBodyScroll } from 'body-scroll-lock'
import {
  AblyChannel,
  AblyEvent,
  type DisplayUpdateNotification,
  type SimpleTrackInfo
} from 'models'
import { useEffect, useRef, useState } from 'react'
import styles from './LyricsDisplay.module.scss'

export default function LyricsDisplay() {
  const [lines, setLines] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [simpleTrackInfo, setSimpleTrackInfo] = useState<SimpleTrackInfo>()
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    disableBodyScroll(mainRef.current as HTMLElement)
    const ablyClient = new Realtime(
      'wYnVEA.Ge4Eag:AhrNqn5M9oxZxGqJk6vwz1BYZF419EnDmjpLOD5r9_0'
    )
    const ably = ablyClient.channels.get(AblyChannel.MAIN)
    ably.publish(AblyEvent.JOIN, {}).then()
    ably
      .subscribe(AblyEvent.DISPLAY_UPDATE, async notification => {
        handleDisplayUpdateNotification(
          notification.data as DisplayUpdateNotification
        )
      })
      .then()
    return () => {
      ably.unsubscribe()
      ablyClient.close()
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
      <div className={styles.topbar}>
        <img
          className={styles.menuIcon}
          src={menuOpen ? '/close.svg' : '/meatballs-menu.svg'}
          alt='menu'
          onClickCapture={() => {
            setMenuOpen(curr => !curr)
          }}
        />
      </div>
      <div
        className={styles.menuIsland}
        style={{
          zIndex: menuOpen ? 99 : -99
        }}
      >
        <div className={styles.menuContent}>
          <h1>Project 448</h1>
          <h2>By Shun</h2>
          <ul>
            <li>
              Request a Song <i>(Coming soon)</i>
            </li>
            <li>
              Contribute on{' '}
              <a target='_blank' href='https://github.com/shunueda/project-448'>
                GitHub
              </a>
            </li>
            <li>
              Make a donation:{' '}
              <a
                target='_blank'
                href='https://account.venmo.com/pay?recipients=Kirk-Yap'
              >
                @Kirk-Yap
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.lyricsArea}>
        {lines.map((line, i) => (
          <div className={styles.shelf}>
            <p
              className={styles.line}
              style={{
                color:
                  i < Math.floor(lines.length / 2)
                    ? '#3f3f3f'
                    : `rgba(220, 220, 220, ${1 - Math.abs(i - Math.floor(lines.length / 2)) / 2.2})`
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
            {simpleTrackInfo?.artist} · {simpleTrackInfo?.album}
          </p>
        </div>
      </div>
    </main>
  )
}
