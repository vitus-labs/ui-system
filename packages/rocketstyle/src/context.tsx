import React, { ReactNode, FC, useContext, ComponentType } from 'react'
import { Provider as CoreProvider, context } from '@vitus-labs/core'

type Theme = {
  rootSize: number
  breakpoints?: Record<string, number>
  __VITUS_LABS__?: never
} & Record<string, unknown>

export type TProvider = {
  theme: Theme
  variant: 'light' | 'dark'
  inversed?: boolean
  children: ReactNode
  provider: ComponentType<any>
}

const Provider: FC<TProvider> = ({
  theme,
  variant,
  children,
  inversed,
  provider: RocketstyleProvider = CoreProvider,
}) => {
  if (inversed) {
    const { provider: InnerProvider, variant: ctxVariant, ...ctx } = useContext(
      context
    )
    const isDark = ctxVariant === 'dark'
    const inversedTheme = isDark ? 'light' : 'dark'

    return (
      <InnerProvider
        variant={inversedTheme}
        isDark={isDark}
        isLight={!isDark}
        {...ctx}
      >
        {children}
      </InnerProvider>
    )
  }

  const isDark = variant === 'dark'

  return (
    <RocketstyleProvider
      variant={variant}
      isDark={isDark}
      isLight={!isDark}
      theme={theme}
      provider={RocketstyleProvider}
    >
      {children}
    </RocketstyleProvider>
  )
}

// eslint-disable-next-line import/prefer-default-export
export { context }
export default Provider
