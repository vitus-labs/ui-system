import { useContext } from 'react'
import { context } from '~/context'
import { THEME_MODES_INVERSED } from '~/constants/reservedKeys'
import { ThemeModeKeys } from '~/types/theme'

type UseThemeAttrs = ({ inversed }: { inversed?: boolean }) => {
  theme: Record<string, unknown>
  mode: ThemeModeKeys
  isDark: boolean
  isLight: boolean
}

const useThemeAttrs: UseThemeAttrs = ({ inversed }) => {
  const {
    theme,
    mode: ctxMode = 'light',
    isDark: ctxDark,
  } = useContext(context) || {}

  const mode = inversed ? THEME_MODES_INVERSED[ctxMode] : ctxMode
  const isDark = inversed ? !ctxDark : ctxDark
  const isLight = !isDark

  return { theme, mode, isDark, isLight }
}

export default useThemeAttrs
