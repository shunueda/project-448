import dotenv from 'dotenv'
import getPlaylistedTracks from './spotify/getPlaylistedTracks'
import { Track } from '@spotify/web-api-ts-sdk'
import getYouTubeUrl from './youtube/getYouTubeUrl'
import override from './override'
import downloadAudio from './youtube/downloadAudio'
import fetchLyrics from './spotify/fetchLyrics'
import lyricsDataToLrc from './lyricsDataToLrc'

dotenv.config({
  path: `../${process.env.NODE_ENV === 'development' ? '.env.development' : '.env'}`,
  override: true
})

const playlistedTracks = await getPlaylistedTracks(process.env.PLAYLIST_ID)

for (const playlistedTrack of playlistedTracks) {
  const track = playlistedTrack.track as Track
  const musicUrl = await getYouTubeUrl(track, override)
  console.log(musicUrl);
  await downloadAudio(musicUrl, playlistedTrack.track as Track, 'tracks')
}


