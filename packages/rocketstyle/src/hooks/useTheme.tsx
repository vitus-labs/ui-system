import { useContext } from 'react'
import { context } from '~/context/context'
import { THEME_MODES_INVERSED } from '~/constants'
import { ThemeModeKeys } from '~/types/theme'

type Context = {
  theme: Record<string, unknown>
  mode: ThemeModeKeys
  isDark: boolean
  isLight: boolean
}

type UseThemeAttrs = ({ inversed }: { inversed?: boolean }) => Context

const useThemeAttrs: UseThemeAttrs = ({ inversed }) => {
  const {
    theme,
    mode: ctxMode = 'light',
    isDark: ctxDark,
  } = useContext<Context>(context) || {}

  const mode = inversed ? THEME_MODES_INVERSED[ctxMode] : ctxMode
  const isDark = inversed ? !ctxDark : ctxDark
  const isLight = !isDark

  return { theme, mode, isDark, isLight }
}

export default useThemeAttrs
