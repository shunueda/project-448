import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

const env = loadEnv('', process.cwd())

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/vdj': {
				target: 'http://127.0.0.1:80',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/vdj/, '')
			},
			'/get_spotify_access_token': {
				target: 'https://open.spotify.com/get_access_token',
				changeOrigin: true,
				headers: {
					Cookie: `sp_dc=${env.VITE_SPOTIFY_SP_DC}`
				},
				rewrite: path => path.replace(/^\/get_spotify_access_token/, '')
			}
		}
	}
})
