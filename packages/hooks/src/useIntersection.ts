import { useCallback, useRef, useState } from 'react'

type UseIntersectionOptions = {
  threshold?: number | number[]
  rootMargin?: string
  root?: Element | null
}

export type UseIntersection = (
  options?: UseIntersectionOptions,
) => [(node: Element | null) => void, IntersectionObserverEntry | null]

/**
 * Observes an element's intersection with the viewport (or a root element).
 * Returns `[ref, entry]` — pass `ref` as a callback ref.
 */
const useIntersection: UseIntersection = (options = {}) => {
  const { threshold = 0, rootMargin = '0px', root = null } = options
  // Serialize array thresholds so an inline `[0, .5, 1]` literal doesn't
  // change the callback-ref identity on every render.
  const thresholdKey = Array.isArray(threshold)
    ? threshold.join(',')
    : threshold
  const thresholdRef = useRef(threshold)
  thresholdRef.current = threshold
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: thresholdKey is the stable serialization of threshold
  const ref = useCallback(
    (node: Element | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      if (!node || typeof IntersectionObserver === 'undefined') return

      const observer = new IntersectionObserver(
        (entries) => {
          setEntry(entries[entries.length - 1] ?? null)
        },
        { threshold: thresholdRef.current, rootMargin, root },
      )

      observer.observe(node)
      observerRef.current = observer
    },
    [thresholdKey, rootMargin, root],
  )

  return [ref, entry]
}

export default useIntersection
