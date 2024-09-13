import type { LyricsNotification } from 'model'
import { cn } from '../lib/utils'
import styles from './Lyrics.module.scss'

interface Props {
  notification: LyricsNotification
}

export default function Lyrics({ notification }: Props) {
  const middle = Math.floor(notification.lyrics.length / 2)
  const opacity = 0.45
  return (
    <div className={styles.lyrics}>
      {notification.lyrics?.map((line, index) => {
        const key = index.toString()
        return (
          <div key={key} className={styles.box}>
            <p
              key={key}
              className={cn(styles.line, index < middle && styles.done)}
              style={{
                opacity: index <= middle ? 1 : 1 - opacity * (index - middle)
              }}
            >
              {line}
            </p>
          </div>
        )
      })}
    </div>
  )
}
