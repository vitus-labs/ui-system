/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, FC } from 'react'
import config from '~/config'
import isEmpty from '~/isEmpty'

const context = createContext<any>({})
const VitusLabsProvider = context.Provider

type Theme = Partial<
  {
    rootSize: number
    breakpoints: Record<string, number | string>
  } & Record<string, unknown>
>

type ProviderType = Partial<
  {
    theme: Theme
  } & Record<string, unknown>
>

const Provider: FC<ProviderType> = ({ theme, children, ...props }) => {
  if (!theme || isEmpty(theme)) return <>{children}</>

  const StyledContext = config.styledContext

  if (StyledContext) {
    return (
      <VitusLabsProvider value={{ theme, ...props }}>
        <StyledContext theme={theme}>{children}</StyledContext>
      </VitusLabsProvider>
    )
  }

  return (
    <VitusLabsProvider value={{ theme, ...props }}>
      {children}
    </VitusLabsProvider>
  )
}

export { context }

export default Provider
