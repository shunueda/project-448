import type { AppProps } from 'next/app'
import localFont from 'next/font/local'
import '../styles/globals.css'

const circular = localFont({
  src: [
    {
      path: './lineto-circular-bold.ttf',
      weight: '400',
      style: 'bold'
    },
    {
      path: './lineto-circular-medium.ttf',
      weight: '400',
      style: 'italic'
    }
  ]
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={circular.className}>
      <Component {...pageProps} />
    </main>
  )
}
