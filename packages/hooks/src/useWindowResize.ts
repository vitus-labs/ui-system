import { useState, useEffect } from 'react'
import { throttle } from '@vitus-labs/core'

export type UseWindowResize = (
  throttleDelay?: number,
  defaultValues?: Partial<{
    width: number
    height: number
  }>
) => {
  width: number
  height: number
}

const useWindowResize: UseWindowResize = (
  throttleDelay = 200,
  { width = 0, height = 0 } = {}
) => {
  const [windowSize, setWindowSize] = useState({ width, height })

  useEffect(() => {
    const getSize = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = throttle(() => {
      setWindowSize(getSize())
    }, throttleDelay)

    window.addEventListener('resize', handleResize, false)

    return () => window.removeEventListener('resize', handleResize, false)
  }, [throttleDelay])

  return windowSize
}

export default useWindowResize
