import React, { useMemo } from 'react'
import type { ReactNode, FC } from 'react'
import {
  config,
  isEmpty,
  Provider as CoreProvider,
  context,
} from '@vitus-labs/core'
import { sortBreakpoints, createMediaQueries } from '~/responsive'

// type VitusLabsContext = {
//   sortedBreakpoints?: ReturnType<typeof sortBreakpoints>
//   media?: ReturnType<typeof createMediaQueries>
// }

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
  const { breakpoints, rootSize } = theme

  const sortedBreakpoints = useMemo(() => {
    if (breakpoints && !isEmpty(breakpoints)) {
      return sortBreakpoints(breakpoints)
    }

    return undefined
  }, [breakpoints])

  const media = useMemo(() => {
    if (breakpoints && !isEmpty(breakpoints)) {
      return createMediaQueries({
        breakpoints,
        css: config.css,
        rootSize,
      })
    }

    return undefined
  }, [breakpoints, rootSize])

  const result = {
    ...theme,
    __VITUS_LABS__: {
      sortedBreakpoints,
      media,
    },
  }

  return (
    <CoreProvider theme={result} {...props}>
      {children}
    </CoreProvider>
  )
}

export { context }

export default Provider
