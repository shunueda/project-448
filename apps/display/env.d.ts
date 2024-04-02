// NEXT_PUBLIC_ABLY_API_KEY
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ABLY_API_KEY: string
    }
  }
}

export {}
