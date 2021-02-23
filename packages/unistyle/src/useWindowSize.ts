import { useState, useEffect } from 'react'
import { throttle } from '@vitus-labs/core'

type UseWindowSize = (
  throttleDelay?: number,
  defaultValues?: Partial<{
    width: number
    height: number
  }>
) => { width: number | undefined; height: number | undefined }

const useWindowSize: UseWindowSize = (
  throttleDelay = 200,
  { width = undefined, height = undefined } = {}
) => {
  const getSize = () => ({
    width: __CLIENT__ ? window.innerWidth : width,
    height: __CLIENT__ ? window.innerHeight : height,
  })

  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(() => {
    if (__SERVER__) return undefined

    const handleResize = throttle(() => {
      setWindowSize(getSize())
    }, throttleDelay)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return windowSize
}

export default useWindowSize
