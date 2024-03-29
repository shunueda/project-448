export interface DisplayUpdateNotification {
  lines: string[]
  trackInfo: SimpleTrackInfo
}

export interface SimpleTrackInfo {
  trackId: string
  coverArtUrl: string
  album: string
  artist: string
  title: string
}
