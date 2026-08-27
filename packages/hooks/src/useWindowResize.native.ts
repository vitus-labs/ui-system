import { useEffect, useRef, useState } from 'react'
import { Dimensions, type DimensionsPayload } from 'react-native'

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
    // RN 0.87 types `addEventListener`'s handler as bare `Function`, so the
    // payload has to be annotated here — and `window` is optional on it.
    const sub = Dimensions.addEventListener(
      'change',
      ({ window }: DimensionsPayload) => {
        if (!window) return
        const sizes = { width: window.width, height: window.height }
        setWindowSize(sizes)
        onChangeRef.current?.(sizes)
      },
    )

    return () => sub.remove()
  }, [])

  return windowSize
}

export default useWindowResize
