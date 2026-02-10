'use client'

import { createContext, useContext, type FC, type ReactNode } from 'react'

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
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DefaultTheme {}

type Theme = DefaultTheme & Record<string, unknown>

const ThemeContext = createContext<Theme>({})

/** Hook to read the current theme from the nearest ThemeProvider. */
export const useTheme = <T extends Theme = Theme>(): T =>
  useContext(ThemeContext) as T

/** Provides a theme object to all nested styled components via React context. */
export const ThemeProvider: FC<{
  theme: Theme
  children: ReactNode
}> = ({ theme, children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
)
