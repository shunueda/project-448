import type { TrackNotification } from 'model'
import Image from 'next/image'
import styles from './Island.module.scss'

interface Props {
  notification: TrackNotification
}

export default function Island({ notification }: Props) {
  return (
    <div className={styles.island}>
      <div className={styles.picture}>
        <Image alt={Island.name} src={notification.picture} fill />
      </div>
      <div className={styles.text}>
        <p>{notification.title}</p>
        <p>
          {notification.artist} - {notification.album}
        </p>
      </div>
    </div>
  )
}
