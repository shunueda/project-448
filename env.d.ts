declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SPOTIFY_SP_DC: string
      SPOTIFY_CLIENT_ID: string
      SPOTIFY_CLIENT_SECRET: string
      PLAYLIST_ID: string
      VDJ_DIR: string
      VDJ_PLAYLIST_NAME: string
    }
  }
}

export {}