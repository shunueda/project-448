import type { NextApiRequest, NextApiResponse } from 'next'
import { IAudioMetadata, parseFile } from 'music-metadata'

export interface GetMetadataBody {
  filepath: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IAudioMetadata>
) {
  const { filepath } = JSON.parse(req.body) as GetMetadataBody
  const metadata = await parseFile(filepath)
  res.status(200).json(metadata)
}
