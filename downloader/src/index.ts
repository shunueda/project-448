import dotenv from 'dotenv'
import getPlaylistedTracks from './spotify/getPlaylistedTracks'
import { Track } from '@spotify/web-api-ts-sdk'
import getYouTubeUrl from './youtube/getYouTubeUrl'
import override from './override'
import downloadAudio from './youtube/downloadAudio'
import { existsSync, statSync, unlinkSync, writeFileSync } from 'fs'
import { EOL } from 'os'
import { parseFile } from 'music-metadata'

dotenv.config({
  path: `../${process.env.NODE_ENV === 'development' ? '.env.development' : '.env'}`,
  override: true
})

const playlistedTracks = await getPlaylistedTracks(process.env.PLAYLIST_ID)

const trackWithLocalPaths = []
for (const playlistedTrack of playlistedTracks) {
  const track = playlistedTrack.track as Track
  const musicUrl = await getYouTubeUrl(track, override)
  trackWithLocalPaths.push(await downloadAudio(musicUrl, playlistedTrack.track as Track, 'tracks'))
}

const m3uFile = `${process.env.VDJ_DIR}/Playlists/${process.env.VDJ_PLAYLIST_NAME}.m3u`
if (existsSync(m3uFile)) {
  unlinkSync(m3uFile)
}
writeFileSync(m3uFile, (await Promise.all(trackWithLocalPaths.map(async trackWithLocalPaths => {
  const fileSize = statSync(trackWithLocalPaths.localPath).size
  const metadata = await parseFile(trackWithLocalPaths.localPath)
  return [
    `#EXTVDJ:<filesize>${fileSize}</filesize><artist>${trackWithLocalPaths.artists.map(artist => {
      return artist.name
    }).join('/')}</artist><title>${trackWithLocalPaths.name}</title><songlength>${metadata.format.duration}</songlength>`,
    trackWithLocalPaths.localPath
  ].join(EOL)
}))).join(EOL))


