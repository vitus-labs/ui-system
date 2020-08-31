import React, { forwardRef, useMemo, ReactNode } from 'react'
import { config, pick } from '@vitus-labs/core'
import { vitusContext, optimizeTheme } from '@vitus-labs/unistyle'
import { Direction, AlignX, AlignY, Booltype } from '~/types'
import { isFixNeeded } from './utils'
import Styled from './styled'

const KEYWORDS_WRAPPER = ['block', 'extendCss']
const KEYWORDS_INNER = ['direction', 'alignX', 'alignY', 'equalCols']
const KEYWORDS = [...KEYWORDS_WRAPPER, ...KEYWORDS_INNER]

type Reference = any

type Props = {
  children: ReactNode
  tag: import('styled-components').StyledComponentPropsWithRef<any>
  direction: Direction
  alignX: AlignX
  alignY: AlignY
  equalCols: Booltype
} & Record<string, any>

const Element = forwardRef<Reference, Partial<Props>>(
  (
    {
      children,
      tag,
      block,
      extendCss,
      direction,
      alignX,
      alignY,
      equalCols,
      ...props
    },
    ref
  ) => {
    const needsFix = useMemo(() => isFixNeeded(tag, config.isWeb), [tag])

    const stylingProps = {
      block,
      extendCss,
      direction,
      alignX,
      alignY,
      equalCols,
    }

    const debugProps =
      process.env.NODE_ENV !== 'production'
        ? {
            'data-vb-element': 'Element',
          }
        : {}

    const { sortedBreakpoints } = vitusContext()

    const normalizedTheme = useMemo(
      () =>
        optimizeTheme({
          breakpoints: sortedBreakpoints,
          keywords: KEYWORDS,
          props: stylingProps,
        }),
      [
        sortedBreakpoints,
        block,
        extendCss,
        direction,
        alignX,
        alignY,
        equalCols,
      ]
    )

    const COMMON_PROPS = {
      ref,
      as: tag,
      ...props,
      ...debugProps,
    }

    if (!needsFix || config.isNative) {
      return (
        <Styled {...COMMON_PROPS} $element={normalizedTheme}>
          {children}
        </Styled>
      )
    }

    return (
      <Styled
        {...COMMON_PROPS}
        $needsFix
        $element={pick(normalizedTheme, KEYWORDS_WRAPPER)}
      >
        <Styled
          as="span"
          $isInner
          $element={pick(normalizedTheme, KEYWORDS_INNER)}
        >
          {children}
        </Styled>
      </Styled>
    )
  }
)

export default Element
