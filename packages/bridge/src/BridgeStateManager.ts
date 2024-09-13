import { basename, extname } from 'node:path'
import { StringUtils, config, notEquals } from 'common'
import { getCoverArtFromId } from 'common'
import {
  Event as AblyEvent,
  Channel,
  type LyricsNotification,
  type TrackNotification
} from 'model'
import { ablyRealtime } from './ably/ablyRealtime'
import { readLyricsData } from './io/readLyricsData'
import { readMetadata } from './io/readMetadata'
import { Deck, getDeckFromCrossfader } from './virtualdj/Deck'
import type { DeckState } from './virtualdj/DeckState'
import type { SubscriptionData } from './virtualdj/SubscriptionData'
import { Trigger } from './virtualdj/Trigger'

export class BridgeStateManager {
  private readonly ablyChannel = ablyRealtime.channels.get(Channel.MAIN)
  private readonly defaultLyrics = this.center('No lyrics... yet.')
  private readonly state: DeckState = {
    left: {
      id: StringUtils.EMPTY,
      position: 0
    },
    right: {
      id: StringUtils.EMPTY,
      position: 0
    },
    deck: Deck.CENTER
  }
  private trackNotification: TrackNotification = {
    id: StringUtils.EMPTY,
    title: StringUtils.EMPTY,
    album: StringUtils.EMPTY,
    artist: StringUtils.EMPTY,
    picture: StringUtils.EMPTY
  }
  private lyricsNotification: LyricsNotification = {
    lyrics: this.defaultLyrics
  }

  constructor() {
    this.ablyChannel.presence
      .subscribe('enter', async () => {
        await this.publish(AblyEvent.TRACK, this.trackNotification)
        await this.publish(AblyEvent.LYRICS, this.lyricsNotification)
      })
      .then()
      .catch()
  }

  public async update(data: SubscriptionData) {
    this.updateState(data)
    const { id, position } = this.getCurrentDeckstate()
    if (!id) {
      return
    }
    const offsettedPosition = position + config.lyrics.offset
    const lyricsNotification = await this.createLyricsNotification(
      id,
      offsettedPosition
    )
    if (notEquals(this.lyricsNotification, lyricsNotification)) {
      this.lyricsNotification = lyricsNotification
      await this.publish(AblyEvent.LYRICS, this.lyricsNotification)
    }
    const trackNotification = await this.createTrackNotification(id)
    if (this.trackNotification.id !== trackNotification.id) {
      this.trackNotification = trackNotification
      await this.publish(AblyEvent.TRACK, this.trackNotification)
    }
  }

  private async createLyricsNotification(id: string, position: number) {
    const lyricsData = await readLyricsData(id)
    const defaultNotification = { lyrics: this.defaultLyrics }
    if (!lyricsData) {
      return defaultNotification
    }
    const { lines } = lyricsData.lyrics
    const current = lines.findIndex(line => position <= line.startTimeMs) - 1
    if (current < -1) {
      return defaultNotification
    }
    const total = config.lyrics.lines
    const before = Math.floor(total / 2)
    const start = Math.max(0, current - before)
    const end = Math.min(lines.length, current + before + 1)
    const lyrics = []
    for (let i = start; i < end; i++) {
      lyrics.push(StringUtils.orEmpty(lines[i].words))
    }
    for (let i = 0; i < Math.max(0, before - current); i++) {
      lyrics.unshift(StringUtils.EMPTY)
    }
    for (let i = 0; i < total - lyrics.length; i++) {
      lyrics.push(StringUtils.EMPTY)
    }
    return { lyrics } satisfies LyricsNotification
  }

  private async createTrackNotification(id: string) {
    const { title, album, artist } = (await readMetadata(id)).common
    return {
      id,
      title: StringUtils.orEmpty(title),
      album: StringUtils.orEmpty(album),
      artist: StringUtils.orEmpty(artist),
      picture: await getCoverArtFromId(id)
    } satisfies TrackNotification
  }

  private updateState(data: SubscriptionData) {
    switch (data.trigger) {
      case Trigger.DECK_1_FILENAME: {
        const filename = data.value as string
        this.state.left.id = basename(filename, extname(filename))
        break
      }
      case Trigger.DECK_2_FILENAME: {
        const filename = data.value as string
        this.state.right.id = basename(filename, extname(filename))
        break
      }
      case Trigger.DECK_1_ELAPSED_TIME: {
        this.state.left.position = data.value as number
        break
      }
      case Trigger.DECK_2_ELAPSED_TIME: {
        this.state.right.position = data.value as number
        break
      }
      case Trigger.CROSSFADER: {
        this.state.deck = getDeckFromCrossfader(data.value as number)
        break
      }
    }
  }

  private getCurrentDeckstate() {
    if (this.state.deck === Deck.CENTER) {
      // If the crossfader is in the center, left takes precedence but if left is empty, right is used
      return this.state.left.id ? this.state.left : this.state.right
    }
    return this.state.deck === Deck.LEFT ? this.state.left : this.state.right
  }

  private center(...lyrics: string[]): string[] {
    const target = config.lyrics.lines - lyrics.length
    const left = Math.floor(target / 2)
    return [
      ...Array(left).fill(StringUtils.EMPTY),
      ...lyrics,
      ...Array(target - left).fill(StringUtils.EMPTY)
    ]
  }

  private async publish<T>(event: AblyEvent, data: T) {
    await this.ablyChannel.publish(event, data)
  }
}
