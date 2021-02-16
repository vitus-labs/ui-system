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
    const { variant: ctxVariant, ...ctx } = useContext(context)

    const inversedTheme = ctxVariant === 'dark' ? 'light' : 'dark'
    return (
      <RocketstyleProvider variant={inversedTheme} {...ctx}>
        {children}
      </RocketstyleProvider>
    )
  }

  return (
    <RocketstyleProvider variant={variant} theme={theme}>
      {children}
    </RocketstyleProvider>
  )
}

// eslint-disable-next-line import/prefer-default-export
export { context }
export default Provider
