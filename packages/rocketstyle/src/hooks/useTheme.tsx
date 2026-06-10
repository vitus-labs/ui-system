import { useContext } from 'react'
import { THEME_MODES_INVERSED } from '~/constants'
import { context } from '~/context/context'
import type { ThemeModeKeys } from '~/types/theme'

type Context = {
  theme: Record<string, unknown>
  mode: ThemeModeKeys
  isDark: boolean
  isLight: boolean
}

type UseThemeAttrs = ({ inversed }: { inversed?: boolean }) => Context

// Referentially-stable fallback — a fresh `{}` destructure default would be
// a NEW object every render in no-Provider apps, missing the WeakMap theme
// caches (ThemeManager) and invalidating downstream useMemo deps on every
// render of every rocketstyle component.
const EMPTY_THEME: Record<string, unknown> = {}

/**
 * Retrieves the current theme object and resolved mode from context.
 * Supports mode inversion so nested components can flip between
 * light and dark without a new provider.
 */
const useThemeAttrs: UseThemeAttrs = ({ inversed }) => {
  const {
    theme = EMPTY_THEME,
    mode: ctxMode = 'light',
    isDark: ctxDark,
  } = useContext<Context>(context) || {}

  const mode = inversed ? THEME_MODES_INVERSED[ctxMode] : ctxMode
  const isDark = inversed ? !ctxDark : ctxDark
  const isLight = !isDark

  // Callers destructure the primitives; the 4-key useMemo + dep compare cost
  // more than re-allocating this small object per render.
  return { theme, mode, isDark, isLight }
}

export default useThemeAttrs
