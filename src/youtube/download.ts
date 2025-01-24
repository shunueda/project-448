import type { Track } from '@spotify/web-api-ts-sdk'
import { Utils, YTNodes } from 'youtubei.js'
import { client } from '#youtube/client'

export async function download(
  track: Track
): Promise<AsyncGenerator<Uint8Array>> {
  const artists = track.artists.map(it => it.name).join(' ')
  const search = await client.search(`${track.name} - ${artists} "Audio"`, {
    type: 'video'
  })
  const id = search.results.filterType(YTNodes.Video).first().id
  const stream = await client.download(id, {
    type: 'audio',
    quality: 'best',
    client: 'IOS'
  })
  return Utils.streamToIterable(stream)
}
