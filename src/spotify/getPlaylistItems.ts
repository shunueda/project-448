import type { PlaylistedTrack, Track } from '@spotify/web-api-ts-sdk'
import { client } from '#spotify/client'

const limit = 50

export async function getPlaylistItems(id: string): Promise<Track[]> {
  const tracks: PlaylistedTrack[] = []
  let offset = 0
  while (true) {
    const { items } = await client.playlists.getPlaylistItems(
      id,
      undefined,
      undefined,
      limit,
      offset
    )
    tracks.push(...items)
    if (items.length < limit) {
      break
    }
    offset += limit
  }
  return tracks.map(it => it.track as Track)
}
