import Config from 'config'
import { AblyChannel, AblyEvent, type DisplayUpdateNotification } from 'models'
import { setInterval } from 'node:timers/promises'
import { fetchLyrics } from 'shared'
import ablyClient from './ably/ablyClient'
import parseMetadata from './parseMetadata'
import getCurrentDeckState from './vdj/getCurrentDeckState'
import runVdjScript from './vdj/runVdjScript'

let latestNotification: DisplayUpdateNotification | undefined = undefined
const ably = ablyClient.channels.get(AblyChannel.MAIN)

const LINES = 7

for await (const _ of setInterval(Config.interceptor_interval)) {
  try {
    const vdjState = await runVdjScript('get_state')
    const deckState = getCurrentDeckState(vdjState)
    const metadata = await parseMetadata(deckState.filepath)
    const trackId = metadata.common.comment![0]
    const lyricsData = await fetchLyrics(trackId)
    const currentIndex = lyricsData.lyrics.lines.findIndex(
      line =>
        line.startTimeMs >
        deckState.position + Config.interceptor_position_buffer
    )
    const lines = lyricsData.lyrics.lines
      .slice(
        Math.max(currentIndex - Math.ceil(LINES / 2), 0),
        Math.min(
          currentIndex + Math.floor(LINES / 2),
          lyricsData.lyrics.lines.length
        )
      )
      .map(line => line.words)
    const startEmptyLinesCount = Math.max(
      Math.ceil(LINES / 2) - currentIndex,
      0
    )
    const endEmptyLinesCount = LINES - (lines.length + startEmptyLinesCount)
    for (let i = 0; i < startEmptyLinesCount; i++) {
      lines.unshift('')
    }
    for (let i = 0; i < endEmptyLinesCount; i++) {
      lines.push('')
    }
    const displayUpdateNotification: DisplayUpdateNotification = {
      lines,
      trackInfo: {
        trackId,
        artist: metadata.common.artist!,
        title: metadata.common.title!,
        album: metadata.common.album!
      }
    }
    if (
      JSON.stringify(displayUpdateNotification) !==
      JSON.stringify(latestNotification)
    ) {
      latestNotification = displayUpdateNotification
      console.log(latestNotification.lines)
      await ably.publish(AblyEvent.DISPLAY_UPDATE, latestNotification)
    }
  } catch (e) {}
}
