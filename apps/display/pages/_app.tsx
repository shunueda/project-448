import type { AppProps } from 'next/app'
import localFont from 'next/font/local'
import Head from 'next/head'
import '../styles/globals.css'

const circular = localFont({
  src: [
    {
      path: './lineto-circular-bold.ttf',
      weight: '600',
      style: 'bold'
    },
    {
      path: './lineto-circular-medium.ttf',
      weight: '400',
      style: 'normal'
    }
  ]
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Project 448</title>
        <link rel='icon shortcut' href='/favicon.ico' sizes='any' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='black-translucent'
        />
      </Head>
      <main className={circular.className}>
        <Component {...pageProps} />
      </main>
    </>
  )
}
