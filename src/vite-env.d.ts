/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SPOTIFY_SP_DC: string
	readonly VITE_SPOTIFY_CLIENT_ID: string
	readonly VITE_SPOTIFY_CLIENT_SECRET: string
	readonly VITE_PLAYLIST_ID: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}