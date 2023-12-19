import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'
import useAsyncEffect from 'use-async-effect'
import { MutableRefObject, useRef, useState } from 'react'
import VDJState, { DeckState } from '@/lib/models/VDJState'
import runVdjScript from '@/lib/runVdjScript'
import LyricsDisplay from '@/components/LyricsDisplay'
import { isEqual } from 'underscore'
import getCurrentDeckState from '@/lib/getCurrentDeckState'
import { IAudioMetadata } from 'music-metadata'
import getMetadata from '@/lib/getMetadata'
import ImageBufferData from '@/lib/models/ImageBufferData'
import createImageUrlFromBuffer from '@/lib/createImageUrlFromBuffer'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const intervalRef = useRef<NodeJS.Timeout>()
  const [vdjState, setVdjState] = useState<VDJState>()
  const [deckState, setDeckState] = useState<DeckState>()
  const [metadata, setMetadata] = useState<IAudioMetadata>()
  const [imageUrl, setImageUrl] = useState<string>()

  function clearIntervalRef(ref: MutableRefObject<NodeJS.Timeout | undefined>) {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  useAsyncEffect(async () => {
    clearIntervalRef(intervalRef)
    intervalRef.current = setInterval(async () => {
      const newState = JSON.parse(await runVdjScript('get_state')) as VDJState
      setVdjState(prevState =>
        !isEqual(newState, prevState) ? newState : prevState
      )
    }, 250)
    return () => {
      clearIntervalRef(intervalRef)
    }
  }, [])

  useAsyncEffect(async () => {
    if (!vdjState) {
      return
    }
    setDeckState(prevState => {
      const newState = getCurrentDeckState(vdjState)
      return !isEqual(newState, prevState) ? newState : prevState
    })
  }, [vdjState])
  useAsyncEffect(async () => {
    if (deckState?.filepath) {
      const newMetadata = await getMetadata(deckState.filepath)
      setMetadata(newMetadata)
      setImageUrl(createImageUrlFromBuffer(((newMetadata?.common?.picture?.at(0)?.data) as unknown as ImageBufferData)))
    }
  }, [deckState?.filepath])

  return (
    <main className={`${styles.main} ${inter.className}`}>
      <div className={styles.left}>
        <img src={imageUrl} alt='' className={styles.cover} />
        <p>{metadata?.common.title}</p>
      </div>
      <div className={styles.right}>
        <div className={styles.lyricsDisplay}>
          <LyricsDisplay deckState={deckState} metadata={metadata} />
        </div>
      </div>
    </main>
  )
}
