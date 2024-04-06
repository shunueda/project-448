import styles from './Icon.module.scss'

interface Props {
  src: string
  caption: string
  url: string
}

export default function Icon({ src, caption, url }: Props) {
  return (
    <div className={styles.icon}>
      <div
        className={styles.icon}
        onClickCapture={() => {
          open(url, 'target="_blank" rel="noopener noreferrer"')
        }}
        style={{
          backgroundImage: `url(${src})`
        }}
      />
      <p className={styles.caption}>{caption}</p>
    </div>
  )
}
