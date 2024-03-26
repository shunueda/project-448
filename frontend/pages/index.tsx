import getCurrentDeckState from 'lib/getCurrentDeckState'
import getMetadata from 'lib/getMetadata'
import VDJState from 'lib/models/VDJState'
import runVdjScript from 'lib/runVdjScript'
import { MutableRefObject, useRef, useState } from 'react'
import { isEqual } from 'underscore'
import useAsyncEffect from 'use-async-effect'

export default function Home() {
  const intervalRef = useRef<NodeJS.Timeout>()
  const [vdjState, setVdjState] = useState<VDJState>()
  function clearIntervalRef(ref: MutableRefObject<NodeJS.Timeout | undefined>) {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }
  useAsyncEffect(async () => {
    clearIntervalRef(intervalRef)
    intervalRef.current = setInterval(async () => {
      const newS = JSON.parse(await runVdjScript('get_state')) as VDJState
      setVdjState(prevS => (!isEqual(newS, prevS) ? newS : prevS))
    }, 250)
    return () => {
      clearIntervalRef(intervalRef)
    }
  }, [])
  useAsyncEffect(async () => {
    if (vdjState) {
      const deckState = getCurrentDeckState(vdjState)
      const metadata = await getMetadata(deckState.filepath)
      const trackId = metadata.common.comment!.at(0)!
    }
  }, [vdjState])
  return <>Hello, world!</>
}
