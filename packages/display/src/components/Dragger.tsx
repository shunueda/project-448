import { HandMetalIcon } from 'lucide-react'
import type { TrackNotification } from 'model'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Dragger.module.scss'
import { DragHandle } from './tools/DragHandle'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
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
      <Alert>
        <HandMetalIcon className="h-4 w-4" />
        <AlertTitle className="text-zinc-600">Support the Party</AlertTitle>
        <AlertDescription className="text-zinc-500">
          All donators will receive a special gift at the upcoming party!
        </AlertDescription>
      </Alert>
      <Separator className="my-4" />
      <div className="flex h-4 space-x-2 text-xs justify-end">
        <div>
          Venmo <span className="text-xs">(@ushun)</span>
        </div>
        <Separator orientation="vertical" />
        <Link target="_blank" href="https://www.instagram.com/448japchae/">
          Instagram <span className="text-xs">(@448japchae)</span>
        </Link>
      </div>
    </div>
  )
}
