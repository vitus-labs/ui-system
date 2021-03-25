import { useContext } from 'react'
import { context } from '~/context'
import { THEME_MODES_INVERSED } from '~/constants/reservedKeys'

type UseThemeOptions = ({
  inversed,
}: {
  inversed?: boolean
}) => {
  theme: Record<string, unknown>
  mode: 'light' | 'dark'
  isDark: boolean
  isLight: boolean
}

const useThemeOptions: UseThemeOptions = ({ inversed }) => {
  const { theme, mode: ctxMode, isDark: ctxDark } = useContext(context) as any
  const mode = inversed ? THEME_MODES_INVERSED[ctxMode] : ctxMode
  const isDark = inversed ? !ctxDark : ctxDark
  const isLight = !isDark

  return { theme, mode, isDark, isLight }
}

export default useThemeOptions
