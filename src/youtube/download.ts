import assert from 'node:assert/strict'
import type { Track } from '@spotify/web-api-ts-sdk'
import { Utils } from 'youtubei.js'
import { client } from '#youtube/client'

export async function download(
  track: Track
): Promise<AsyncGenerator<Uint8Array, void, unknown>> {
  const artists = track.artists.map(it => it.name).join(' ')
  const query = `${artists} ${track.name}`
  const search = await client.music.search(query, {
    type: 'song'
  })
  const item = search.songs?.contents.at(0)
  assert(item?.id)
  return client
    .download(item.id, {
      type: 'audio',
      quality: 'best',
      client: 'IOS'
    })
    .then(Utils.streamToIterable)
}
