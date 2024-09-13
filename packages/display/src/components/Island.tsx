import type { TrackNotification } from 'model'
import Image from 'next/image'
import type { Dispatch, Ref, SetStateAction } from 'react'
import { Drawer } from 'vaul'
import styles from './Island.module.scss'

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>
  notification: TrackNotification
}

export function Island({ notification, setIsOpen }: Props) {
  return (
    <div
      className={styles.island}
      onTouchStartCapture={() => setIsOpen(isOpen => !isOpen)}
    >
      <div className={styles.picture}>
        <Image alt={Island.name} src={notification.picture} fill quality={1} />
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
