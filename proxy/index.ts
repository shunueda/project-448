import { createProxyMiddleware } from 'http-proxy-middleware'
import express from 'express'
import cors from 'cors'
import getAllPlaylistItems from './util/getAllPlaylistItems'
import 'dotenv-flow/config'
import { PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import fetchLyrics from './fetchSpotifyLyrics'
import spotifyClient from './spotifyClient'
import { parseFile } from 'music-metadata'

const app = express()
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }))

const tracks = await getAllPlaylistItems(process.env.PLAYLIST_ID!)

app.get('/spotify/track/:name', async (req, res) => {
	const candidates = tracks.filter(it => )
	if (!playlistedTrack) {
		res.status(404).send('Track not found')
		return
	}
	res.json({
		...playlistedTrack,
		lyricsData: fetchLyrics(playlistedTrack.track.id),
		addedUser: spotifyClient.users.profile(playlistedTrack.added_by.id)
	})
})

app.use(
	'/',
	createProxyMiddleware({
		target: 'http://127.0.0.1:80',
		changeOrigin: true
	})
)

const PORT = process.env.PORT || 2000
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
