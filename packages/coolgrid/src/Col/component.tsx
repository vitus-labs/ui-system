import React, { ComponentType, FC, ReactNode, useContext } from 'react'
import { omit } from '@vitus-labs/core'
import { extendedCss } from '@vitus-labs/unistyle'
import { CONTEXT_KEYS } from '~/constants'
import useGridContext from '~/useContext'
import { RowContext } from '~/context'
import type { Css, ConfigurationProps } from '~/types'
import Styled from './styled'

// const KEYWORDS = ['columns', 'gap', 'gutter']
// const omitKeywords = __WEB__ ? KEYWORDS : [...KEYWORDS, 'RNparentWidth']

// const isHidden = ({ sortedBreakpoints, size, currentBreakpoint }) => {
//   let foundBp = false
//   let hidden = false
//   const reversed = sortedBreakpoints.slice().reverse()

//   for (let i = 0; i < sortedBreakpoints.length; i += 1) {
//     const item = reversed[i]

//     if (item === currentBreakpoint) {
//       foundBp = true
//     }

//     if (foundBp && Number.isFinite(size[item])) {
//       hidden = size[item] === 0 || false
//       break
//     }
//   }

//   return hidden
// }

type Props = Partial<{
  children: ReactNode
  component: ComponentType
  css: Css
}> &
  ConfigurationProps &
  Partial<{
    columns: never
    gap: never
    gutter: never
  }>

type ElementType<
  P extends Record<string, unknown> = Record<string, unknown>
> = FC<P & Props>

const Element: ElementType = ({ children, component, css, ...props }) => {
  const parentCtx = useContext(RowContext)
  const { colCss, colComponent, ...ctx } = useGridContext({
    ...parentCtx,
    ...props,
  })

  // hide column when size=0 for a breakpoint and up
  // if (normalizedTheme.size) {
  //   if (
  //     isHidden({
  //       sortedBreakpoints: breakpoints,
  //       size: normalizedTheme.size,
  //       currentBreakpoint: vitusLabsCtx.getCurrentBreakpoint(ctx.breakpoints),
  //     })
  //   )
  //     return null
  // }

  return (
    <Styled
      {...omit(props, CONTEXT_KEYS)}
      as={component || colComponent}
      $coolgrid={{
        ...ctx,
        extendCss: extendedCss(css || colCss),
      }}
    >
      {children}
    </Styled>
  )
}

Element.displayName = '@vitus-labs/coolgrid/Col'

export default Element
