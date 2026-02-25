import { context } from '@vitus-labs/core'
import { useContext, useMemo } from 'react'

type RootSizeResult = {
  rootSize: number
  pxToRem: (px: number) => string
  remToPx: (rem: number) => number
}

export type UseRootSize = () => RootSizeResult

/**
 * Returns `rootSize` from the theme context along with
 * `pxToRem` and `remToPx` conversion utilities.
 *
 * Defaults to `16` when no Provider is mounted.
 */
const useRootSize: UseRootSize = () => {
  const ctx = useContext(context) as
    | { theme?: { rootSize?: number } }
    | undefined

  const rootSize = ctx?.theme?.rootSize ?? 16

  return useMemo(
    () => ({
      rootSize,
      pxToRem: (px: number) => `${px / rootSize}rem`,
      remToPx: (rem: number) => rem * rootSize,
    }),
    [rootSize],
  )
}

export default useRootSize
