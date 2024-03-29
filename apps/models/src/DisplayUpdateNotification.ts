export interface DisplayUpdateNotification {
  lines: string[]
  trackInfo: SimpleTrackInfo
}

export interface SimpleTrackInfo {
  trackId: string
  album: string
  artist: string
  title: string
}
