import type { FC, ReactNode } from 'react'
import { createContext, useMemo } from 'react'
import config from '~/config'
import isEmpty from '~/isEmpty'
import type { Breakpoints } from '~/types'

/**
 * Internal React context shared across all @vitus-labs packages.
 * Carries the theme object plus any extra provider props.
 */
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

/**
 * Dual-layer provider that feeds both the internal VitusLabs context
 * and an optional external styling provider (e.g. styled-components'
 * ThemeProvider). When no theme is supplied, renders children directly.
 */
const Provider: FC<ProviderType> = ({ theme, children, ...props }) => {
  const ExternalProvider = useMemo(() => config.ExternalProvider, [])
  const context = useMemo(
    () => ({ theme, ...props }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, ...Object.values(props), props],
  )

  // eslint-disable-next-line react/jsx-no-useless-fragment
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
