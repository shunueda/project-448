export interface DisplayUpdateNotification {
  lines: LyricsLine[]
  trackInfo: SimpleTrackInfo
}

export interface LyricsLine {
  words: string
  current: boolean
}

export interface SimpleTrackInfo {
  trackId: string
  coverArtUrl: string
  album: string
  artist: string
  title: string
}
