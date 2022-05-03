import React, { useContext, ReactNode, FC, ComponentType } from 'react'
import { Provider as CoreProvider, context } from '@vitus-labs/core'

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

const Provider: FC<TProvider> = ({ provider = CoreProvider, ...props }) => {
  const ctx = useContext<TProvider>(context)

  const {
    theme,
    mode,
    inversed,
    provider: RocketstyleProvider,
    children,
  } = { ...ctx, ...props, provider }

  const isDark = inversed ? mode !== 'dark' : mode === 'dark'

  return (
    <RocketstyleProvider
      mode={mode}
      isDark={isDark}
      isLight={!isDark}
      theme={theme}
      provider={provider}
    >
      {children}
    </RocketstyleProvider>
  )
}

export { context }

export default Provider
