import React, { forwardRef, useCallback } from 'react'
import { renderContent } from '@vitus-labs/core'
import { Wrapper, Content } from '~/helpers'
import {
  transformVerticalProp,
  calculateSubTag,
  getShouldBeEmpty,
} from './utils'
import type { Props } from './types'

const defaultDirection = 'inline'
const defaultAlignX = 'left'
const defaultAlignY = 'center'

const Component = forwardRef<any, Props>(
  (
    {
      innerRef,
      tag,
      label,
      content,
      children,
      beforeContent,
      afterContent,

      block,
      equalCols,
      gap,

      vertical,
      direction,
      alignX = defaultAlignX,
      alignY = defaultAlignY,

      css,
      contentCss,
      beforeContentCss,
      afterContentCss,

      contentDirection = defaultDirection,
      contentAlignX = defaultAlignX,
      contentAlignY = defaultAlignY,

      beforeContentDirection = defaultDirection,
      beforeContentAlignX = defaultAlignX,
      beforeContentAlignY = defaultAlignY,

      afterContentDirection = defaultDirection,
      afterContentAlignX = defaultAlignX,
      afterContentAlignY = defaultAlignY,

      ...props
    },
    ref
  ) => {
    // --------------------------------------------------------
    // check if should render only single element
    // --------------------------------------------------------
    const shouldBeEmpty =
      !!props.dangerouslySetInnerHTML ||
      (__WEB__ && tag && getShouldBeEmpty(tag))

    // --------------------------------------------------------
    // common wrapper props
    // --------------------------------------------------------
    const WRAPPER_PROPS = {
      ref: ref || innerRef,
      extendCss: css,
      tag,
      block,
      contentDirection,
      alignX: contentAlignX,
      alignY: contentAlignY,
      as: undefined, // reset styled-components `as` prop
    }

    // --------------------------------------------------------
    // return simple/empty element like input
    // --------------------------------------------------------
    if (shouldBeEmpty) return <Wrapper {...WRAPPER_PROPS} {...props} />

    // --------------------------------------------------------
    // if not single element, calculate values
    // --------------------------------------------------------
    const isSimple = !beforeContent && !afterContent
    const CHILDREN = children || content || label

    const SUB_TAG = __WEB__ && tag && calculateSubTag(tag) ? 'span' : undefined

    // --------------------------------------------------------
    // direction & alignX calculations
    // --------------------------------------------------------
    let wrapperDirection: typeof direction
    let wrapperAlignX: typeof alignX = alignX
    let wrapperAlignY: typeof alignY = alignY

    const calculateDirection = useCallback(() => {
      if (isSimple) {
        if (contentDirection) wrapperDirection = contentDirection
        if (contentAlignX) wrapperAlignX = contentAlignX
        if (contentAlignY) wrapperAlignY = contentAlignY
      } else if (direction) {
        wrapperDirection = direction
      } else if (vertical !== undefined && vertical !== null) {
        wrapperDirection = transformVerticalProp(vertical)
      } else {
        wrapperDirection = defaultDirection
      }
    }, [isSimple, direction, vertical])

    calculateDirection()

    return (
      <Wrapper
        {...props}
        {...WRAPPER_PROPS}
        direction={wrapperDirection}
        alignX={wrapperAlignX}
        alignY={wrapperAlignY}
      >
        {!isSimple && (
          <Content
            tag={SUB_TAG}
            contentType="before"
            parentDirection={wrapperDirection}
            extendCss={beforeContentCss}
            direction={beforeContentDirection}
            alignX={beforeContentAlignX}
            alignY={beforeContentAlignY}
            equalCols={equalCols}
            gap={gap}
          >
            {renderContent(beforeContent)}
          </Content>
        )}

        {!isSimple ? (
          <Content
            tag={SUB_TAG}
            contentType="content"
            parentDirection={wrapperDirection}
            extendCss={contentCss}
            direction={contentDirection}
            alignX={contentAlignX}
            alignY={contentAlignY}
            equalCols={equalCols}
          >
            {renderContent(CHILDREN)}
          </Content>
        ) : (
          renderContent(CHILDREN)
        )}

        {!isSimple && (
          <Content
            tag={SUB_TAG}
            contentType="after"
            parentDirection={wrapperDirection}
            extendCss={afterContentCss}
            direction={afterContentDirection}
            alignX={afterContentAlignX}
            alignY={afterContentAlignY}
            equalCols={equalCols}
            gap={gap}
          >
            {renderContent(afterContent)}
          </Content>
        )}
      </Wrapper>
    )
  }
)

Component.displayName = 'vitus-labs/elements/Element'

export default Component
