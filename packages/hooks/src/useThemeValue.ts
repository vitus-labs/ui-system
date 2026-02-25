import { context, get } from '@vitus-labs/core'
import { useContext } from 'react'

export type UseThemeValue = <T = unknown>(path: string) => T | undefined

/**
 * Deep-reads a value from the current theme by dot-separated path.
 *
 * @example
 * ```ts
 * const primary = useThemeValue<string>('colors.primary')
 * const columns = useThemeValue<number>('grid.columns')
 * ```
 */
const useThemeValue: UseThemeValue = (path) => {
  const ctx = useContext(context) as
    | { theme?: Record<string, unknown> }
    | undefined
  const theme = ctx?.theme
  if (!theme) return undefined
  return get(theme, path)
}

export default useThemeValue
