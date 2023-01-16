import { useState, useEffect } from 'react'
import { throttle } from '@vitus-labs/core'

type Sizes = {
  width: number
  height: number
}

export type UseWindowResize = (
  params: Partial<{
    throttleDelay: number
    onChange: (params: Sizes) => void
  }>,
  initialValues?: Partial<Sizes>
) => Sizes

const useWindowResize: UseWindowResize = (
  { throttleDelay = 200, onChange } = {},
  { width = 0, height = 0 } = {}
) => {
  const [windowSize, setWindowSize] = useState({ width, height })

  useEffect(() => {
    const getSize = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const calculatedSize = getSize()

    setWindowSize(calculatedSize)

    if (onChange) {
      onChange(calculatedSize)
    }

    const handleResize = throttle(() => {
      setWindowSize(getSize())
      if (onChange) {
        onChange(calculatedSize)
      }
    }, throttleDelay)

    window.addEventListener('resize', handleResize, false)

    return () => window.removeEventListener('resize', handleResize, false)
  }, [throttleDelay])

  return windowSize
}

export default useWindowResize
