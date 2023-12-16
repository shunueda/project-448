import LyricsData from './models/LyricsData'

export default function lyricsDataToLrc(lyricsData: LyricsData) {
  const { lines } = lyricsData.lyrics
  let lrcContent = ''
  lines.forEach(line => {
    const time = msToLrcTime(line.startTimeMs)
    lrcContent += `[${time}] ${line.words}\n`
  })
  return lrcContent
}

function msToLrcTime(ms) {
  const [minutes, seconds, hundredths] = [
    ms / 60000,
    (ms % 60000) / 1000,
    (ms % 1000) / 10
  ].map(Math.floor)
  return `${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(hundredths, 2)}`
}

function pad(num, size) {
  let s = num.toString()
  while (s.length < size) {
    s = '0' + s
  }
  return s
}