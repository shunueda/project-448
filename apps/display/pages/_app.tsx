import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.scss'

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
      <Component {...pageProps} />
    </>
  )
}
