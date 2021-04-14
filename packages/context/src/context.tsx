import React, { createContext, FC } from 'react'
import { config, isEmpty } from '@vitus-labs/core'

const context = createContext<any>({})

const StyledProvider = config.styledContext.Provider
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

  return (
    <VitusLabsProvider value={{ theme, ...props }}>
      <StyledProvider value={theme}>{children}</StyledProvider>
    </VitusLabsProvider>
  )
}

export { context }

export default Provider
