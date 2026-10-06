import { type RefObject, useEffect, useState } from 'react'
import useRefElement from './useRefElement'

export type UseResizeObserver = (
  ref: RefObject<HTMLElement | null>,
) => DOMRectReadOnly | null

/**
 * Returns the latest `contentRect` of the referenced element via a
 * shared `ResizeObserver`. Reads `null` until the first observation.
 * Safe to render with — uses state so the component re-renders when
 * dimensions change.
 *
 * Lower-level than `useElementSize` (which returns `{width, height}`
 * numbers); this hook exposes the full DOMRect so consumers can read
 * top/left for absolute positioning.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * const rect = useResizeObserver(ref)
 * return <div ref={ref}>w: {rect?.width ?? 0}</div>
 * ```
 */
const useResizeObserver: UseResizeObserver = (ref) => {
  const [rect, setRect] = useState<DOMRectReadOnly | null>(null)
  // Tracked as state so late-mounting elements get observed.
  const node = useRefElement(ref)

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return undefined
    if (!node) return undefined

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setRect(entry.contentRect)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [node])

  return rect
}

export default useResizeObserver
