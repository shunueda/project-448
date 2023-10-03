import addMetadata from '../addMetadata'
import spotifyClient from '../SpotifyClient'
import mkdir from 'make-dir'

const id = process.argv[2]

const track = await spotifyClient.tracks.get(id)

await mkdir('out/artifacts')
await addMetadata(track.id, {
	title: track.name,
	album: track.album.name,
	artist: track.artists.map(artist => artist.name).join('/'),
	cover: track.album.images[0].url
})
