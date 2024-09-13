import type { Metadata } from 'next'
import packageInfo from 'project-448/package.json'
import './globals.css'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: packageInfo.name,
  description: packageInfo.description
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={'antialiased'}>{children}</body>
    </html>
  )
}
