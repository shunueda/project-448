import Image from 'next/image'
import styles from './Island.module.scss'

export default function Island() {
  return (
    <div className={styles.island}>
      <div className={styles.picture}>
        <Image
          alt={Island.name}
          src="https://i.scdn.co/image/ab67616d0000b273659cd4673230913b3918e0d5"
          fill
        />
      </div>
      <div className={styles.text}>
        <p>Taste</p>
        <p>Sabrina Carpenter - Taste</p>
      </div>
    </div>
  )
}
