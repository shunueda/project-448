export interface DisplayUpdateNotification {
  lines: string[]
  trackInfo: SimpleTrackInfo
}

export interface SimpleTrackInfo {
  cover: string
  album: string
  artist: string
  title: string
}
