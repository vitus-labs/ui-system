import { Provider as CoreProvider, context } from '@vitus-labs/core'
import { type ComponentType, type FC, type ReactNode, useContext } from 'react'
import { MODE_DEFAULT, THEME_MODES_INVERSED } from '~/constants'

type Theme = {
  rootSize: number
  breakpoints?: Record<string, number>
  __VITUS_LABS__?: never
} & Record<string, unknown>

export type TProvider = {
  children: ReactNode
  theme?: Theme
  mode?: 'light' | 'dark'
  inversed?: boolean
  provider?: ComponentType<any>
}

const Provider: FC<TProvider> = ({
  provider = CoreProvider,
  inversed,
  ...props
}) => {
  const ctx = useContext<TProvider>(context)

  const {
    theme,
    mode,
    provider: RocketstyleProvider,
    children,
  } = { ...ctx, ...props, provider }

  let newMode = MODE_DEFAULT

  if (mode) {
    newMode = inversed ? THEME_MODES_INVERSED[mode] : mode
  }

  return (
    <RocketstyleProvider
      mode={newMode}
      isDark={newMode === 'dark'}
      isLight={newMode === 'light'}
      theme={theme}
      provider={provider}
    >
      {children}
    </RocketstyleProvider>
  )
}

export { context }

export default Provider
