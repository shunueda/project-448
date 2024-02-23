declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development'
      SPOTIFY_SP_DC: string
      SPOTIFY_CLIENT_ID: string
      SPOTIFY_CLIENT_SECRET: string
      VDJ_DIR: string
    }
  }
}

export {}
