import { type DisplayUpdateNotification } from 'models'
import styles from './LyricsDisplay.module.scss'

interface Props {
  notification: DisplayUpdateNotification
}

export default function LyricsDisplay({ notification }: Props) {
  const mainIndex = notification.lines.findIndex(line => line.current)
  return (
    <div className={styles.main}>
      <div className={styles.lyricsArea}>
        {notification.lines.map((line, i) => (
          <div className={styles.shelf} key={i}>
            <p
              className={styles.line}
              style={{
                color:
                  i === mainIndex
                    ? '#e5e5e5'
                    : i < mainIndex
                      ? '#3d3d3d'
                      : '#888888',
                opacity:
                  i <= mainIndex
                    ? 1
                    : 1 -
                      (i - mainIndex) * (1 / (notification.lines.length - 1.7))
              }}
            >
              {line.words}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
