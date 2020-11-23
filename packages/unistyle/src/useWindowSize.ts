import { useState, useEffect } from 'react'
import { throttle } from '@vitus-labs/core'

type UseWindowSize = (
  throttleDelay: number
) => { width: number; height: number }

const useWindowSize: UseWindowSize = (throttleDelay = 200) => {
  const isClient = typeof window === 'object'

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    }
  }

  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(() => {
    if (!isClient) return undefined

    const handleResize = throttle(() => {
      setWindowSize(getSize())
    }, throttleDelay)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return windowSize
}

export default useWindowSize
