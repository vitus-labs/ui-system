import { useEffect, useRef, useState } from 'react'
import { Dimensions } from 'react-native'

type Sizes = {
  width: number
  height: number
}

export type UseWindowResize = (
  params?: Partial<{
    throttleDelay: number
    onChange: (params: Sizes) => void
  }>,
  initialValues?: Partial<Sizes>,
) => Sizes

/**
 * Tracks the React Native window dimensions.
 * Uses `Dimensions` API instead of `window.innerWidth/innerHeight`.
 * The `throttleDelay` parameter is accepted for API compat but not used
 * (RN dimension events fire infrequently).
 */
const useWindowResize: UseWindowResize = (
  { onChange } = {},
  { width, height } = {},
) => {
  const [windowSize, setWindowSize] = useState<Sizes>(() => {
    const dim = Dimensions.get('window')
    return {
      width: width ?? dim.width,
      height: height ?? dim.height,
    }
  })

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      const sizes = { width: window.width, height: window.height }
      setWindowSize(sizes)
      onChangeRef.current?.(sizes)
    })

    return () => sub.remove()
  }, [])

  return windowSize
}

export default useWindowResize
