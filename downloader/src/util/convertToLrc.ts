import { EOL } from 'node:os'
import type LyricsData from '../models/LyricsData'

export default function convertToLrc(lyricsData: LyricsData) {
  return lyricsData.lyrics.lines
    .map(line => `[${formatTime(line.startTimeMs)}]${line.words}`)
    .join(EOL)
}

function pad0(n: number) {
  return n.toString().padStart(2, '0')
}

function formatTime(ms: number) {
  const secondsTotal = ms / 1000
  const minutes = Math.floor(secondsTotal / 60)
  const seconds = Math.floor(secondsTotal % 60)
  const hundredths = Math.floor((secondsTotal % 1) * 100)
  return `${pad0(minutes)}:${pad0(seconds)}.${pad0(hundredths)}`
}
