import type { MutableRefObject, Ref } from 'react'
import { useCallback } from 'react'

export type UseMergedRef = <T>(
  ...refs: (Ref<T> | undefined)[]
) => (node: T | null) => void

/**
 * Merges multiple refs (callback or object) into a single stable callback ref.
 * Handles null, callback refs, and object refs with `.current`.
 */
const useMergedRef = <T>(...refs: (Ref<T> | undefined)[]) => {
  return useCallback(
    (node: T | null) => {
      for (const ref of refs) {
        if (!ref) continue
        if (typeof ref === 'function') {
          ref(node)
        } else {
          ;(ref as MutableRefObject<unknown>).current = node
        }
      }
    },
    // biome-ignore lint/correctness/useExhaustiveDependencies: refs array identity doesn't matter, individual refs do
    refs,
  )
}

export default useMergedRef
