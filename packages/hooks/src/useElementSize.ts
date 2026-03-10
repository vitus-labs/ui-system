import { useCallback, useRef, useState } from 'react'

type Size = { width: number; height: number }

export type UseElementSize = () => [(node: Element | null) => void, Size]

/**
 * Tracks an element's `width` and `height` via `ResizeObserver`.
 * Returns `[ref, { width, height }]` — pass `ref` as a callback ref.
 */
const useElementSize: UseElementSize = () => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })
  const observerRef = useRef<ResizeObserver | null>(null)

  const ref = useCallback((node: Element | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    if (!node || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      setSize((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      )
    })

    observer.observe(node)
    observerRef.current = observer

    // Read initial size with bail-out to avoid double setState
    const rect = node.getBoundingClientRect()
    setSize((prev) =>
      prev.width === rect.width && prev.height === rect.height
        ? prev
        : { width: rect.width, height: rect.height },
    )
  }, [])

  return [ref, size]
}

export default useElementSize
