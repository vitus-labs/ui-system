import React, { createContext, FC } from 'react'
import { config, isEmpty } from '@vitus-labs/core'

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
        <StyledContext.Provider value={theme}>
          {children}
        </StyledContext.Provider>
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
