export interface LyricsNotification {
  readonly lyrics: string[]
}

export interface TrackNotification {
  readonly id: string
  readonly title: string
  readonly album: string
  readonly artist: string
  readonly picture: string
}
