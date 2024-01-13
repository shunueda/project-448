import dotenv from 'dotenv'
import getPlaylistedTracks from './spotify/getPlaylistedTracks'
import { Track } from '@spotify/web-api-ts-sdk'
import getYouTubeUrl from './youtube/getYouTubeUrl'
import override from './override'
import downloadAudio from './youtube/downloadAudio'
import { existsSync, statSync, unlinkSync, writeFileSync } from 'fs'
import { EOL } from 'os'
import { parseFile } from 'music-metadata'
import './config'

const playlistedTracks = await getPlaylistedTracks(process.env.PLAYLIST_ID)
const trackWithLocalPaths = []

for (const playlistedTrack of playlistedTracks) {
  const track = playlistedTrack.track as Track
  const musicUrl = await getYouTubeUrl(track, override)
  try {
    trackWithLocalPaths.push(await downloadAudio(musicUrl, track, 'tracks'))
  } catch (_) {
    console.log(`Failed to download ${track.name}`)
  }
}

const m3uFilePath = `${process.env.VDJ_DIR}/Playlists/${process.env.VDJ_PLAYLIST_NAME}.m3u`

if (existsSync(m3uFilePath)) {
  unlinkSync(m3uFilePath)
}

const playlistContent = await Promise.all(trackWithLocalPaths.map(async (track) => {
  const fileSize = statSync(track.localPath).size
  const metadata = await parseFile(track.localPath)
  const artistNames = track.artists.map(artist => artist.name).join('/')
  const trackInfo = `#EXTVDJ:<filesize>${fileSize}</filesize><artist>${artistNames}</artist><title>${track.name}</title><songlength>${metadata.format.duration}</songlength>`
  return [trackInfo, track.localPath].join(EOL)
}))

writeFileSync(m3uFilePath, playlistContent.join(EOL))


