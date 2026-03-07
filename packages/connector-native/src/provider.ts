import {
  createContext,
  createElement,
  type FC,
  type ReactNode,
  useContext,
} from 'react'

const ThemeContext = createContext<any>({})

/**
 * Provides a theme object to all descendant components via React context.
 * Used by `styled()` components to resolve dynamic theme-based interpolations.
 */
export const ThemeProvider: FC<{ theme: any; children: ReactNode }> = ({
  theme,
  children,
}) => createElement(ThemeContext.Provider, { value: theme }, children)

/**
 * Returns the current theme from the nearest `ThemeProvider`.
 * Defaults to an empty object when no provider is mounted.
 */
export const useTheme = (): any => useContext(ThemeContext)
