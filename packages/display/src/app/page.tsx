'use client'
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'
import { useEffect, useRef, useState } from 'react'
import Island from '../components/Island'
import styles from './page.module.scss'

export default function Home() {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const lyricsHeighRatio = 0.85

  useEffect(() => {
    if (ref.current) {
      disableBodyScroll(ref.current)
    }
    setHeight(window.innerHeight)
    return () => {
      clearAllBodyScrollLocks()
    }
  }, [])

  return (
    <main ref={ref} className={styles.root} style={{ height }}>
      <section
        className={styles.lyrics}
        style={{
          height: height * lyricsHeighRatio
        }}
      >
        A
      </section>
      <section
        className={styles.island}
        style={{
          height: height * (1 - lyricsHeighRatio)
        }}
      >
        <Island />
      </section>
    </main>
  )
}
