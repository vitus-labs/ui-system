import React, { forwardRef, useMemo } from 'react'
import { renderContent } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import { Wrapper, Content } from '~/helpers'
import type { VLForwardedComponent } from '~/types'
import { isInlineElement, getShouldBeEmpty } from './utils'

import type { Props } from './types'

const defaultDirection = 'inline'
const defaultContentDirection = 'rows'
const defaultAlignX = 'left'
const defaultAlignY = 'center'

const component: VLForwardedComponent<Props> = forwardRef(
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

      direction = defaultDirection,
      alignX = defaultAlignX,
      alignY = defaultAlignY,

      css,
      contentCss,
      beforeContentCss,
      afterContentCss,

      contentDirection = defaultContentDirection,
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
      as: undefined, // reset styled-components `as` prop
    }

    // --------------------------------------------------------
    // return simple/empty element like input or image etc.
    // --------------------------------------------------------
    if (shouldBeEmpty) return <Wrapper {...WRAPPER_PROPS} {...props} />

    // --------------------------------------------------------
    // if not single element, calculate values
    // --------------------------------------------------------
    const isSimpleElement = !beforeContent && !afterContent
    const CHILDREN = children || content || label

    const isInline = __WEB__ ? isInlineElement(tag) : false
    const SUB_TAG = __WEB__ && isInline ? 'span' : undefined

    // --------------------------------------------------------
    // direction & alignX & alignY calculations
    // --------------------------------------------------------
    const calculateDirection = useMemo(() => {
      let wrapperDirection: typeof direction = direction
      let wrapperAlignX: typeof alignX = alignX
      let wrapperAlignY: typeof alignY = alignY

      if (isSimpleElement) {
        if (contentDirection) wrapperDirection = contentDirection
        if (contentAlignX) wrapperAlignX = contentAlignX
        if (contentAlignY) wrapperAlignY = contentAlignY
      } else if (direction) {
        wrapperDirection = direction
      } else {
        wrapperDirection = defaultDirection
      }

      return { wrapperDirection, wrapperAlignX, wrapperAlignY }
    }, [
      isSimpleElement,
      contentDirection,
      contentAlignX,
      contentAlignY,
      alignX,
      alignY,
      direction,
    ])

    const { wrapperDirection, wrapperAlignX, wrapperAlignY } =
      calculateDirection

    const beforeContentRenderOutput = useMemo(
      () => renderContent(beforeContent),
      [beforeContent]
    )

    const afterContentRenderOutput = useMemo(
      () => renderContent(afterContent),
      [afterContent]
    )

    const contentRenderOutput = useMemo(
      () => renderContent(CHILDREN),
      [CHILDREN]
    )

    return (
      <Wrapper
        {...props}
        {...WRAPPER_PROPS}
        isInline={isInline}
        direction={wrapperDirection}
        alignX={wrapperAlignX}
        alignY={wrapperAlignY}
      >
        {beforeContent && (
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
            {beforeContentRenderOutput}
          </Content>
        )}

        {isSimpleElement ? (
          contentRenderOutput
        ) : (
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
            {contentRenderOutput}
          </Content>
        )}

        {afterContent && (
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
            {afterContentRenderOutput}
          </Content>
        )}
      </Wrapper>
    )
  }
)

const name = `${PKG_NAME}/Element` as const

component.displayName = name
component.pkgName = PKG_NAME
component.VITUS_LABS__COMPONENT = name

export default component
