import {
  type DependencyList,
  type EffectCallback,
  useEffect,
  useRef,
} from 'react'

export type UseUpdateEffect = (
  effect: EffectCallback,
  deps?: DependencyList,
) => void

/**
 * Like `useEffect` but skips the initial mount — only fires on updates.
 */
const useUpdateEffect: UseUpdateEffect = (effect, deps) => {
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return undefined
    }
    return effect()
    // biome-ignore lint/correctness/useExhaustiveDependencies: mirrors useEffect's deps contract
  }, deps)
}

export default useUpdateEffect
