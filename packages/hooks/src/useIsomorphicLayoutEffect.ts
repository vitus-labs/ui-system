import { useEffect, useLayoutEffect } from 'react'

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 * Avoids the React SSR warning about useLayoutEffect.
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export type UseIsomorphicLayoutEffect = typeof useIsomorphicLayoutEffect

export default useIsomorphicLayoutEffect
