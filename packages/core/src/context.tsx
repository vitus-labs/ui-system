import React, { createContext, FC, useMemo } from 'react'
import config from '~/config'
import isEmpty from '~/isEmpty'

const context = createContext<any>({})
const VitusLabsProvider = context.Provider

type Theme = Partial<
  {
    rootSize: number
    breakpoints: Record<string, number | string>
  } & Record<string, any>
>

type ProviderType = Partial<
  {
    theme: Theme
  } & Record<string, any>
>

const Provider: FC<ProviderType> = ({ theme, children, ...props }) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!theme || isEmpty(theme)) return <>{children}</>

  const StyledContext = useMemo(() => config.styledContext, [])

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
