import type { PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import { spotifyClientWithAccessToken } from './SpotifyClient'

const LIMIT = 50

export async function getAllPlaylistItems(
  playlistId: string
): Promise<PlaylistedTrack[]> {
  async function fetchTracks(
    offset: number,
    accumulatedTracks: PlaylistedTrack[] = []
  ): Promise<PlaylistedTrack[]> {
    const response =
      await spotifyClientWithAccessToken.playlists.getPlaylistItems(
        playlistId,
        undefined,
        undefined,
        LIMIT,
        offset
      )
    const newAccumulatedTracks = accumulatedTracks.concat(response.items)
    return response.items.length < LIMIT
      ? newAccumulatedTracks
      : fetchTracks(offset + LIMIT, newAccumulatedTracks)
  }
  return fetchTracks(0)
}
