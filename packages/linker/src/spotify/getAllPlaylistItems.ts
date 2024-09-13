import type { PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import { spotifyClient } from './spotifyClient'

const LIMIT = 50

export async function getAllPlaylistItems(
  playlistId: string
): Promise<PlaylistedTrack[]> {
  return getPlaylistItems(playlistId, 0, [])
}

async function getPlaylistItems(
  playlistId: string,
  offset: number,
  accumulatedTracks: PlaylistedTrack[]
): Promise<PlaylistedTrack[]> {
  const response = await spotifyClient.playlists.getPlaylistItems(
    playlistId,
    undefined,
    undefined,
    LIMIT,
    offset
  )
  const newAccumulatedTracks = accumulatedTracks.concat(response.items)
  return response.items.length < LIMIT
    ? newAccumulatedTracks
    : getPlaylistItems(playlistId, offset + LIMIT, newAccumulatedTracks)
}
