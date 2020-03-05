import React, { forwardRef } from 'react'
import config, { pick, renderContent } from '@vitus-labs/core'
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
    const sharedProps = {
      ref: ref || innerRef,
      extendCss: css,
      tag,
      block
    }

    if (shouldBeEmpty)
      return (
        <Wrapper
          {...sharedProps}
          contentDirection="inline"
          alignX="left"
          alignY="center"
          {...props}
        />
      )

    let SUB_TAG
    if (config.isWeb) {
      SUB_TAG = INLINE_ELEMENTS.includes(tag) ? 'span' : 'div'
    }

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

    return (
      <Wrapper
        {...sharedProps}
        contentDirection={wrapperDirection || 'inline'}
        alignX={wrapperAlignX || 'left'}
        alignY={wrapperAlignY || 'center'}
        {...props}
      >
        {beforeContent && (
          <Content
            tag={SUB_TAG}
            extendCss={beforeContentCss}
            contentDirection={beforeContentDirection || 'inline'}
            alignX={beforeContentAlignX || 'left'}
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
            alignX={contentAlignX || 'left'}
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
            alignX={afterContentAlignX || 'left'}
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
