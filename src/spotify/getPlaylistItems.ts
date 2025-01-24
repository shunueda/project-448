import type { PlaylistedTrack, Track } from '@spotify/web-api-ts-sdk'
import { client } from '#spotify/client'

const limit = 50

export async function getPlaylistItems(id: string): Promise<Track[]> {
  const tracks: PlaylistedTrack[] = []
  let offset = 0
  let next = true
  while (next) {
    const response = await client.playlists.getPlaylistItems(
      id,
      undefined,
      undefined,
      limit,
      offset
    )
    tracks.push(...response.items)
    next = response.items.length === limit
    offset += limit
  }
  return tracks.map(it => it.track as Track)
}
