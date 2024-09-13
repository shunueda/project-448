import type { Metadata } from 'next'
import packageInfo from 'project-448/package.json'
import './globals.css'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: packageInfo.name,
  description: packageInfo.description
}

const circular = localFont({
  src: [
    {
      path: 'fonts/lineto-circular-book.ttf',
      weight: '400',
      style: 'normal'
    },
    {
      path: 'fonts/lineto-circular-medium.ttf',
      weight: '500',
      style: 'normal'
    },
    {
      path: 'fonts/lineto-circular-bold.ttf',
      weight: '700',
      style: 'normal'
    },
    {
      path: 'fonts/lineto-circular-black.ttf',
      weight: '900',
      style: 'normal'
    }
  ]
})

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${circular.className} antialiased`}>{children}</body>
    </html>
  )
}
