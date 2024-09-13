'use client'
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'
import { useEffect, useRef } from 'react'
import useAsyncEffect from 'use-async-effect'

export default function Home() {
  const ref = useRef<HTMLDivElement>(null)
  useAsyncEffect(() => {}, [])
  useEffect(() => {
    // biome-ignore lint/style/noNonNullAssertion: ref.current is guaranteed to be non-null
    disableBodyScroll(ref.current!)
    return () => {
      clearAllBodyScrollLocks()
    }
  }, [])
  return (
    <main ref={ref}>
      <div>
        <h1>Home</h1>
        <p>Scrolling is disabled</p>
      </div>
    </main>
  )
}
