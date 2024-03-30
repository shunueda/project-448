declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development'
      SPOTIFY_SP_DC: string
      SPOTIFY_CLIENT_ID: string
      SPOTIFY_CLIENT_SECRET: string
      VDJ_DIR: string
      ABLY_API_KEY: string
      ABLY_API_SERVER_KEY: string
    }
  }
}

export {}
