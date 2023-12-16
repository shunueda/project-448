import spotifyClient from './SpotifyClient'
import type { Market, PlaylistedTrack } from '@spotify/web-api-ts-sdk'

export default async function getPlaylistedTracks(
  playlistId: string
): Promise<PlaylistedTrack[]> {
  const limit = 50

  async function fetchTracks(
    offset: number,
    accumulatedTracks: PlaylistedTrack[] = []
  ): Promise<PlaylistedTrack[]> {
    const response = await spotifyClient.playlists.getPlaylistItems(
      playlistId,
      undefined as Market,
      undefined as string,
      limit,
      offset
    )
    const newAccumulatedTracks = accumulatedTracks.concat(response.items)
    return response.items.length < limit
      ? newAccumulatedTracks
      : fetchTracks(offset + limit, newAccumulatedTracks)
  }

  return fetchTracks(0)
}