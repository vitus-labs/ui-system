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
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const ref = useCallback(
    (node: Element | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      if (!node) return

      const observer = new IntersectionObserver(
        (entries) => {
          setEntry(entries[0] ?? null)
        },
        { threshold, rootMargin, root },
      )

      observer.observe(node)
      observerRef.current = observer
    },
    [threshold, rootMargin, root],
  )

  return [ref, entry]
}

export default useIntersection
