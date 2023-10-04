import React, { createContext, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import config from '~/config'
import isEmpty from '~/isEmpty'
import type { Breakpoints } from '~/types'

const context = createContext<any>({})
const VitusLabsProvider = context.Provider

type Theme = Partial<
  {
    rootSize: number
    breakpoints: Breakpoints
  } & Record<string, any>
>

type ProviderType = Partial<
  {
    theme: Theme
    children: ReactNode
  } & Record<string, any>
>

const Provider: FC<ProviderType> = ({ theme, children, ...props }) => {
  const ExternalProvider = useMemo(() => config.ExternalProvider, [])
  const context = useMemo(() => ({ theme, ...props }), [theme, props])

  if (isEmpty(theme) || !theme) return <>{children}</>

  if (ExternalProvider) {
    return (
      <VitusLabsProvider value={context}>
        <ExternalProvider theme={theme}>{children}</ExternalProvider>
      </VitusLabsProvider>
    )
  }

  return <VitusLabsProvider value={context}>{children}</VitusLabsProvider>
}

export { context }

export default Provider
