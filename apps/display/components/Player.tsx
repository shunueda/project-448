import { DisplayUpdateNotification } from 'models'
import { Drawer } from 'vaul'
import Icon from './Icon'
import styles from './Player.module.scss'

interface Props {
  notification: DisplayUpdateNotification
}

export default function Player({ notification }: Props) {
  return (
    <Drawer.Portal>
      <Drawer.Content className={styles.main}>
        <div className={styles.header}>
          <div className={styles.gripBar} />
          <div className={styles.content}>
            <div>
              <div
                className={styles.coverArt}
                style={{
                  backgroundImage: `url(${notification.trackInfo.coverArtUrl || ''})`
                }}
              />
              <div className={styles.titleArea}>
                <h1 className={styles.title}>
                  {notification.trackInfo.title.substring(0, 25) +
                    (notification.trackInfo.title.length > 25 ? '...' : '')}
                </h1>
              </div>
              <h2 className={styles.subtitle}>
                {notification.trackInfo.artist} · {notification.trackInfo.title}
              </h2>
              <hr className={styles.line} />
              <div className={styles.icons}>
                <Icon
                  src='/icons/github.png'
                  caption='Contribute on GitHub'
                  url='https://github.com/shunueda/project-448'
                />
                <Icon
                  src='/icons/spotify.png'
                  caption='Join the Party Playlist'
                  url='https://open.spotify.com/playlist/4EMCSbxebWPAmpX9W8iv1C?si=43a35589539b4803&pt=72139ee529fc3916f022513261c3df63'
                />
                <Icon
                  src='/icons/venmo.png'
                  caption='Venmo @Kirk-Yap'
                  url='https://account.venmo.com/pay?recipients=Kirk-Yap'
                />
              </div>
            </div>
          </div>
          <div className={styles.credit}>
            Copyright © {new Date().getFullYear()} Shun Ueda. All rights
            reserved
          </div>
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  )
}
