import type { Track } from '@spotify/web-api-ts-sdk'
import { searchMusics } from 'node-youtube-music'

export default async function getYouTubeUrl(
  track: Track,
  override: Record<string, string>
) {
  if (override[track.id]) {
    return `https://www.youtube.com/watch?v=${override[track.id]}`
  }
  const artists = track.artists.map(artist => artist.name).join(' ')
  const searchResult = (await searchMusics(`${track.name} ${artists}`)).at(0)
  return `https://www.youtube.com/watch?v=${searchResult?.youtubeId}`
}
