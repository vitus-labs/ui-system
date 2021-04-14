import React, { useMemo, ReactNode, FC } from 'react'
import { config, isEmpty } from '@vitus-labs/core'
import { Provider as CoreProvider, context } from '@vitus-labs/context'
import { sortBreakpoints, createMediaQueries } from '~/responsive'

type VitusLabsContext = {
  sortedBreakpoints?: ReturnType<typeof sortBreakpoints>
  media?: ReturnType<typeof createMediaQueries>
}

type Theme = {
  rootSize: number
  breakpoints?: Record<string, number>
  __VITUS_LABS__?: never
} & Partial<Record<string, unknown>>

export type TProvider = {
  theme: Theme
  children: ReactNode
} & Partial<Record<string, unknown>>

const Provider: FC<TProvider> = ({ theme, children, ...props }) => {
  // eslint-disable-next-line no-underscore-dangle
  const __VITUS_LABS__: VitusLabsContext = {}

  const { breakpoints, rootSize } = theme

  if (!isEmpty(breakpoints)) {
    __VITUS_LABS__.sortedBreakpoints = useMemo(
      () => sortBreakpoints(breakpoints),
      [breakpoints]
    )
    __VITUS_LABS__.media = useMemo(
      () =>
        createMediaQueries({
          breakpoints,
          css: config.css,
          rootSize,
        }),
      [breakpoints, rootSize]
    )
  }

  const result = {
    ...theme,
    __VITUS_LABS__,
  }

  return (
    <CoreProvider theme={result} {...props}>
      {children}
    </CoreProvider>
  )
}

export { context }

// eslint-disable-next-line import/prefer-default-export
export default Provider
