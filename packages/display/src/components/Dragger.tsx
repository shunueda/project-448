import type { TrackNotification } from 'model'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Dragger.module.scss'
import { DragHandle } from './tools/DragHandle'
import { Separator } from './ui/separator'

interface Props {
  track: TrackNotification
}

export function Dragger({ track }: Props) {
  return (
    <div className={styles.dragger}>
      <DragHandle />
      <div className={styles.picture}>
        <Image alt={Dragger.name} src={track.picture} fill priority />
      </div>
      <div className={styles.info}>
        <p>{track.title}</p>
        <p>
          {track.artist} - {track.album}
        </p>
      </div>
      <Separator className="my-4" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Support the Party</h4>
        <p className="text-sm text-muted-foreground">
          All donators will receive a special gift at the upcoming party!
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-4 items-center space-x-2 text-sm">
        <Link href="https://account.venmo.com/pay?recipients=ushun">
          Venmo <span className="text-xs">(@ushun)</span>
        </Link>
        <Separator orientation="vertical" />
        <Link target="_blank" href="https://www.instagram.com/448japchae/">
          Instagram <span className="text-xs">(@448japchae)</span>
        </Link>
      </div>
    </div>
  )
}
