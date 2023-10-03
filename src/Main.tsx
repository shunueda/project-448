import LyricsDisplay from './LyricsDisplay'
import type { PlaylistedTrackWithMetadata } from '../scripts/models/PlaylistedTrackWithMetadata'
import { loadFont } from '@remotion/google-fonts/Poppins'
import { AbsoluteFill, Img, staticFile, useVideoConfig } from 'remotion'
import type { Track } from '@spotify/web-api-ts-sdk'

export default function Main(props: Record<string, unknown>) {
	const font = loadFont()
	const config = useVideoConfig()
	const playlistedTrackWithLyrics =
		props as unknown as PlaylistedTrackWithMetadata
	const track = playlistedTrackWithLyrics.track as Track
	return (
		<AbsoluteFill
			style={{
				background: '#131313'
			}}
		>
			<div
				style={{
					display: 'grid',
					marginRight: 'auto',
					marginLeft: 'auto',
					gridTemplateColumns: '1fr 3fr',
					width: '90%'
				}}
			>
				<div
					style={{
						height: `${config.height}px`,
						width: `100%`,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center',
						color: '#bbbbbb',
						fontFamily: font.fontFamily
					}}
				>
					<Img
						width={200}
						height={200}
						src={track?.album?.images[0]?.url || ''}
					/>
					<h1
						style={{
							marginTop: '1em',
							marginBottom: '0.3em',
							fontSize: '1.5em'
						}}
					>
						{track.name}
					</h1>
					<h2
						style={{
							marginTop: '0.6em',
							fontSize: '1.2em'
						}}
					>
						{track.artists.map(artist => artist.name).join(', ')}
					</h2>
				</div>
				<div>
					<LyricsDisplay
						playlistedTrackWithLyrics={playlistedTrackWithLyrics}
						fontFamily={font.fontFamily}
					/>
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					bottom: 25,
					left: 30,
					fontWeight: 'bold',
					fontSize: '1.2em',
					color: '#bbbbbb',
					fontFamily: font.fontFamily
				}}
			>
				<p
					style={{
						marginTop: '0em',
						marginBottom: '0.5em'
					}}
				>
					Requested on
				</p>
				<Img
					style={{
						width: '30%'
					}}
					src={staticFile('spcode.svg')}
				/>
				<p
					style={{
						marginTop: '0em',
						marginBottom: '0em'
					}}
				>
					by{' '}
					<span
						style={{
							fontStyle: 'italic'
						}}
					>
						{playlistedTrackWithLyrics.addedUser.display_name || ''}
					</span>
				</p>
			</div>
		</AbsoluteFill>
	)
}
