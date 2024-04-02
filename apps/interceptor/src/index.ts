import Config from 'config'
import { AblyChannel, AblyEvent, type DisplayUpdateNotification } from 'models'
import { setInterval } from 'node:timers/promises'
import { fetchLyrics } from 'shared'
import ablyClient from './ably/ablyClient'
import getTrack from './getTrack'
import parseMetadata from './parseMetadata'
import getCurrentDeckState from './vdj/getCurrentDeckState'
import runVdjScript from './vdj/runVdjScript'

let latestNotification: DisplayUpdateNotification | undefined = undefined
const ably = ablyClient.channels.get(AblyChannel.MAIN)

await ably.subscribe(AblyEvent.JOIN, async () => {
  if (latestNotification) {
    await ably.publish(AblyEvent.DISPLAY_UPDATE, latestNotification)
  }
})

for await (const _ of setInterval(Config.interceptor_interval)) {
  try {
    const vdjState = await runVdjScript('get_state')
    const deckState = getCurrentDeckState(vdjState)
    const metadata = await parseMetadata(deckState.filepath)
    const trackId = metadata.common.comment![0]
    const lyricsData = await fetchLyrics(trackId)
    if (!lyricsData) {
      continue
    }
    const { lyrics } = lyricsData
    const currentPositionMs =
      deckState.position + Config.interceptor_position_buffer
    let currentLineIndex = lyrics.lines.findIndex(
      line => currentPositionMs < line.startTimeMs
    )
    if (currentLineIndex === -1) currentLineIndex = lyrics.lines.length
    const emptyLine = { words: '', current: false }
    const startIndex = Math.max(
      0,
      currentLineIndex - Config.display_lines_before - 1
    )
    const endIndex = Math.min(
      lyrics.lines.length,
      currentLineIndex + Config.display_lines_after
    )
    const displayLines = lyrics.lines
      .slice(startIndex, endIndex)
      .map((line, index) => ({
        words: line.words,
        current: index + startIndex === currentLineIndex - 1
      }))
    if (startIndex > 0) {
      for (
        let i = 0;
        i < Config.display_lines_before - (currentLineIndex - 1 - startIndex);
        i++
      ) {
        displayLines.unshift(emptyLine)
      }
    }
    while (
      displayLines.length <
      Config.display_lines_before + Config.display_lines_after + 1
    ) {
      displayLines.push(emptyLine)
    }
    if (
      currentPositionMs < lyrics.lines[0].startTimeMs &&
      displayLines.length > 0
    ) {
      displayLines[0] = { ...displayLines[0], current: false }
      displayLines.unshift(emptyLine)
    }
    const track = await getTrack(trackId)
    const displayUpdateNotification: DisplayUpdateNotification = {
      lines: displayLines.slice(
        0,
        Config.display_lines_before + Config.display_lines_after + 1
      ),
      trackInfo: {
        trackId,
        coverArtUrl: track!.album.images[0].url,
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
      await ably.publish(AblyEvent.DISPLAY_UPDATE, displayUpdateNotification)
    }
  } catch (e) {
    console.error(e)
  }
}
