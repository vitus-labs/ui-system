import React, { FC } from 'react'
import config from '~/config'
import isEmpty from '~/isEmpty'

const StyledProvider = config.styledContext.Provider
const VitusLabsProvider = config.context.Provider

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

export default Provider
