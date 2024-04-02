import { SimpleTrackInfo } from 'models'
import { Dispatch, SetStateAction } from 'react'
import styles from './Island.module.scss'

interface Props {
  simpleTrackInfo: SimpleTrackInfo
  playerOpen: boolean
  setPlayerOpen: Dispatch<SetStateAction<boolean>>
}

export default function Island({
  simpleTrackInfo,
  playerOpen,
  setPlayerOpen
}: Props) {
  return (
    <div
      className={styles.trackInfoArea}
      onTouchStart={() => setPlayerOpen(true)}
      style={{
        transform: playerOpen ? 'translateY(150%)' : 'translateY(0)'
      }}
    >
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
  )
}
