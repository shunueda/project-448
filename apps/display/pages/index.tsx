import { Inter } from 'next/font/google'
import { VdjStateChangeEvent } from 'shared'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return <>{VdjStateChangeEvent.LEFT}</>
}
