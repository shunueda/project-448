import fetchLyrics from 'lib/fetchLyrics'
import LyricsData from 'lib/models/LyricsData'
import { IAudioMetadata, parseFile } from 'music-metadata'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface GetMetadataBody {
  filepath: string
}

export interface IAudioMetadataWithLyricsData extends IAudioMetadata {
  lyricsData: LyricsData
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IAudioMetadata>
) {
  const { filepath } = JSON.parse(req.body) as GetMetadataBody
  const metadata = await parseFile(filepath)
  const lyrics = await fetchLyrics(metadata.common.comment?.at(0)!)
  console.log(lyrics)
  res.status(200).json(metadata)
}
