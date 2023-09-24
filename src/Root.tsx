import { Composition, staticFile } from 'remotion'
import Main from './Main'
import { getAudioDurationInSeconds } from '@remotion/media-utils'
import type { PlaylistedTrackWithLyrics } from '../scripts/models/PlaylistedTrackWithLyrics'

export default function RemotionRoot() {
	const fps = parseInt(process.env.FPS || '60', 10)
	const width = parseInt(process.env.WIDTH || '1920', 10)
	const height = parseInt(process.env.HEIGHT || '1080', 10)
	return (
		<Composition
			id='Main'
			component={Main}
			defaultProps={{}}
			durationInFrames={0}
			calculateMetadata={async ({ props }) => {
				const playlistedTrackWithLyrics =
					props as unknown as PlaylistedTrackWithLyrics
				const durationInSeconds = await getAudioDurationInSeconds(
					staticFile(`audio/${playlistedTrackWithLyrics.track.id}.mp3`)
				)
				return {
					durationInFrames: Math.round(durationInSeconds * fps)
				}
			}}
			fps={fps}
			width={width}
			height={height}
		/>
	)
}
