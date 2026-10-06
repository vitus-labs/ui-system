import type { MutableRefObject, Ref } from 'react'
import { useCallback } from 'react'

export type UseMergedRef = <T>(
  ...refs: (Ref<T> | undefined)[]
) => (node: T | null) => void

const setRef = <T>(ref: Ref<T>, value: T | null): unknown => {
  if (typeof ref === 'function') return ref(value)
  ;(ref as MutableRefObject<T | null>).current = value
  return undefined
}

// Attach one ref and return the function that detaches it. A callback ref
// that returns its own cleanup (React 19) owns detaching; otherwise React's
// contract is to call it with `null`.
const attach = <T>(ref: Ref<T>, node: T): (() => void) => {
  const cleanup = setRef(ref, node)
  return typeof cleanup === 'function'
    ? (cleanup as () => void)
    : () => {
        setRef(ref, null)
      }
}

/**
 * Merges multiple refs (callback or object) into a single stable callback ref.
 * Handles null, callback refs, and object refs with `.current`.
 *
 * Supports React 19 ref cleanups: when a child callback ref returns a
 * function it is invoked on detach instead of calling the ref with `null`.
 */
const useMergedRef = <T>(...refs: (Ref<T> | undefined)[]) => {
  return useCallback(
    (node: T | null) => {
      // Manual / legacy null call — mirror it to every ref.
      if (node === null) {
        for (const ref of refs) if (ref) setRef(ref, null)
        return undefined
      }

      const cleanups: (() => void)[] = []
      for (const ref of refs) if (ref) cleanups.push(attach(ref, node))

      // React 19 calls this instead of `merged(null)` on detach.
      return () => {
        for (const cleanup of cleanups) cleanup()
      }
    },
    // biome-ignore lint/correctness/useExhaustiveDependencies: refs array identity doesn't matter, individual refs do
    refs,
  )
}

export default useMergedRef
