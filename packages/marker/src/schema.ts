interface Tags {
  Author: string
  Title: string
  Album: string
  Flag: number
}

interface Infos {
  SongLength: number
  LastModified: number
  FirstSeen: number
  FirstPlay: number
  LastPlay: number
  PlayCount: number
  Bitrate: number
  Cover: number
}

interface Scan {
  Version: number
  Bpm: number
  AltBpm: number
  Volume: number
  Key: string
  Flag: number
}

// Define separate interfaces for each POI type
interface AutomixPoi {
  Pos: number
  Type: 'automix'
  Point:
    | 'realStart'
    | 'cutStart'
    | 'fadeStart'
    | 'tempoStart'
    | 'tempoEnd'
    | 'cutEnd'
    | 'fadeEnd'
    | 'realEnd'
}

interface BeatgridPoi {
  Pos: number
  Type: 'beatgrid'
}

export interface CuePoi {
  Pos: number
  Type: 'cue'
  Num: number
}

// Union type for all possible POI types
type Poi = AutomixPoi | BeatgridPoi | CuePoi

export interface SongMetadata {
  Tags: Tags
  Infos: Infos
  Scan: Scan
  Poi: Poi[]
  FilePath: string
  FileSize: number
}
