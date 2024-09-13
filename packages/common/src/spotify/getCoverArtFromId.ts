import type { Album, SimplifiedTrack } from '@spotify/web-api-ts-sdk'
import { Endpoint } from 'model'

const url = new URL(Endpoint.SPOTIFY_COVER_ART)

const cache = new Map<string, string>()

export async function getCoverArtFromId(id: string) {
  if (cache.has(id)) {
    // biome-ignore lint/style/noNonNullAssertion: checked
    return cache.get(id)!
  }
  const params = new URLSearchParams()
  params.append('inputType', 'tracks')
  params.append('id', id)
  url.search = params.toString()
  const res = await fetch(url)
  const { album } = (await res.json()) as SimplifiedTrack & {
    album: Album
  }
  const coverArt = album.images[0].url
  cache.set(id, coverArt)
  return coverArt
}
