'use client'

import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useMemo,
} from 'react'

/**
 * Extensible theme interface. Consumers can augment this via module
 * declaration merging for full strict types:
 *
 *   declare module '@vitus-labs/styler' {
 *     interface DefaultTheme {
 *       colors: { primary: string; secondary: string }
 *       spacing: (n: number) => string
 *     }
 *   }
 */
// biome-ignore lint/suspicious/noEmptyInterface: augmentable via module declaration merging
export interface DefaultTheme {}

type Theme = DefaultTheme & Record<string, unknown>

// Empty-theme sentinel — referentially stable, so `DynamicStyled` can skip
// the rawProps.theme write when no provider is mounted. Without this, every
// no-provider dynamic render writes `theme = {}` for nothing (the bench's
// csr-mount / csr-update / csr-many scenarios are all no-provider).
export const EMPTY_THEME: Theme = {}

const ThemeContext = createContext<Theme>(EMPTY_THEME)

/** Hook to read the current theme from the nearest ThemeProvider. */
export const useTheme = <T extends Theme = Theme>(): T =>
  useContext(ThemeContext) as T

/** Provides a theme object to all nested styled components via React context. */
export const ThemeProvider: FC<{
  /** A theme object, or a function receiving the outer theme and returning the new one. */
  theme: Theme | ((outer: Theme) => Theme)
  children: ReactNode
}> = ({ theme, children }) => {
  const outer = useContext(ThemeContext)
  const value = useMemo(
    () => (typeof theme === 'function' ? theme(outer) : theme),
    [theme, outer],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
