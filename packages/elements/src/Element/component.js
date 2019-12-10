import React, { forwardRef } from 'react'
import { pick, renderContent } from '@vitus-labs/core'
import { Wrapper, Content } from '~/helpers'
import { INLINE_ELEMENTS, EMPTY_ELEMENTS } from './constants'

const Element = forwardRef(
  (
    {
      passProps = [],
      innerRef,
      tag,
      block,
      label,
      children,
      beforeContent,
      afterContent,

      equalCols,
      vertical,
      alignX,
      alignY,

      css,
      contentCss,
      beforeContentCss,
      afterContentCss,

      contentDirection,
      contentAlignX,
      contentAlignY,

      beforeContentDirection,
      beforeContentAlignX,
      beforeContentAlignY,

      afterContentDirection,
      afterContentAlignX,
      afterContentAlignY,

      ...props
    },
    ref
  ) => {
    const CHILDREN = children || label
    const shouldBeEmpty = EMPTY_ELEMENTS.includes(tag)

    if (shouldBeEmpty)
      return (
        <Wrapper
          ref={ref || innerRef}
          tag={tag}
          extendCss={css}
          contentDirection="inline"
          alignX="stretch"
          alignY="center"
          block={block}
          {...props}
        />
      )

    const SUB_TAG = INLINE_ELEMENTS.includes(tag) ? 'span' : 'div'
    const INJECTED_PROPS = pick(props, passProps)

    // --------------------------------------------------------
    // direction & alignX calculations
    // --------------------------------------------------------
    let wrapperDirection = 'inline'

    if (contentDirection && !beforeContent && !afterContent) {
      wrapperDirection = contentDirection
    } else if (typeof vertical === 'boolean') {
      wrapperDirection = vertical ? 'rows' : 'inline'
    } else if (typeof vertical === 'object') {
      wrapperDirection = {}
      Object.keys(vertical).forEach(item => {
        wrapperDirection[item] = vertical[item] ? 'rows' : 'inline'
      })
    }

    let wrapperAlignX = alignX
    if (contentAlignX && !beforeContent && !afterContent) {
      wrapperAlignX = contentAlignX
    }

    let wrapperAlignY = alignY
    if (contentAlignY && !beforeContent && !afterContent) {
      wrapperAlignY = contentAlignY
    }

    const getAlignXDirection = (x, direction) => {
      if (x) return x
      if (direction !== 'inline') return 'stretch'
      return 'left'
    }

    return (
      <Wrapper
        ref={ref || innerRef}
        tag={tag}
        extendCss={css}
        contentDirection={wrapperDirection || 'inline'}
        alignX={getAlignXDirection(wrapperAlignX, wrapperDirection)}
        alignY={wrapperAlignY || 'center'}
        block={block}
        {...props}
      >
        {beforeContent && (
          <Content
            tag={SUB_TAG}
            extendCss={beforeContentCss}
            contentDirection={beforeContentDirection || 'inline'}
            alignX={getAlignXDirection(beforeContentAlignX, beforeContentDirection)}
            alignY={beforeContentAlignY || 'center'}
            equalCols={equalCols}
          >
            {renderContent(beforeContent, INJECTED_PROPS)}
          </Content>
        )}

        {beforeContent || afterContent ? (
          <Content
            tag={SUB_TAG}
            extendCss={contentCss}
            contentDirection={contentDirection || 'inline'}
            alignX={getAlignXDirection(contentAlignX, contentDirection)}
            alignY={contentAlignY || 'center'}
            equalCols={equalCols}
            isContent
          >
            {renderContent(CHILDREN, INJECTED_PROPS)}
          </Content>
        ) : (
          renderContent(CHILDREN, INJECTED_PROPS)
        )}

        {afterContent && (
          <Content
            tag={SUB_TAG}
            extendCss={afterContentCss}
            contentDirection={afterContentDirection || 'inline'}
            alignX={getAlignXDirection(afterContentAlignX, afterContentDirection)}
            alignY={afterContentAlignY || 'center'}
            equalCols={equalCols}
          >
            {renderContent(afterContent, INJECTED_PROPS)}
          </Content>
        )}
      </Wrapper>
    )
  }
)

Element.displayName = 'vitus-labs/elements/Element'

export default Element
