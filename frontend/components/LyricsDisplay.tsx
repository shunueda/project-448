import { DeckState } from '@/lib/models/VDJState'
import getLyricsFromMetadata from '@/lib/getLyricsFromMetadata'
import { useEffect, useState } from 'react'
import LyricsData from 'downloader/src/models/LyricsData'
import useAsyncEffect from 'use-async-effect'
import styles from './LyricsDisplay.module.scss'
import { IAudioMetadata } from 'music-metadata'

interface Props {
  deckState: DeckState | undefined
  metadata: IAudioMetadata | undefined
}

export default function LyricsDisplay(props: Props) {
  const [lyricsData, setLyricsData] = useState<LyricsData>()
  const [lyricsIndex, setLyricsIndex] = useState<number>(0)
  const [marginTop, setMarginTop] = useState<number>(0)
  useAsyncEffect(async () => {
    if (!props?.deckState?.filepath || !props?.metadata) {
      return
    }
    const lyricsData = getLyricsFromMetadata(props.metadata)
    setLyricsData(lyricsData)
    let marginTop = 0
    for (let i = 0; i < lyricsData.lyrics.lines.length; i++) {
      const line = lyricsData.lyrics.lines[i]
      marginTop += document.getElementById(`lyrics-line-${i}`)?.offsetTop || 0
      if (line.startTimeMs > props.deckState.position + 500) {
        setLyricsIndex(i)
        break
      }
    }
  }, [props])
  useEffect(() => {
    let totalLineHeight = 0
    const mainElement = document.getElementById('lyricsdisplay')!
    const lineHeights = []
    for (let i = 0; i < lyricsIndex - 1; i++) {
      const line = document.getElementById(`lyrics-line-${i}`)!
      const lineHeight = line.offsetHeight || 0
      totalLineHeight += lineHeight
      lineHeights.push(lineHeight)
    }
    const oneLineHeight = Math.min(...lineHeights)
    const mainHeight = mainElement?.offsetHeight || 0
    setMarginTop(totalLineHeight - mainHeight / 2 + oneLineHeight / 2)
  }, [lyricsIndex])
  return (
    <div className={styles.main} id='lyricsdisplay'>
      <div className={styles.content} style={{ marginTop: `-${marginTop}px` }}>
        {
          lyricsData?.lyrics.lines.map((line, index) => (
            <p className={styles.lyricLine} id={`lyrics-line-${index}`} key={index} style={{
              color: index + 1 === lyricsIndex ? 'red' : 'black'
            }}>
              {line.words}
            </p>
          ))
        }
      </div>
    </div>
  )
}