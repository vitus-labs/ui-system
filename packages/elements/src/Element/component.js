import React, { forwardRef } from 'react'
import config, { pick, renderContent } from '@vitus-labs/core'
import { Wrapper, Content } from '~/helpers'
import { INLINE_ELEMENTS, EMPTY_ELEMENTS } from './constants'
import { transformVerticalProp } from './utils'

const Element = forwardRef(
  (
    {
      forwardProps = [],
      innerRef,
      tag,
      label,
      children,
      beforeContent,
      afterContent,

      block,
      equalCols,
      gap,

      vertical,
      alignX = 'left',
      alignY = 'center',

      css,
      contentCss,
      beforeContentCss,
      afterContentCss,

      contentDirection = 'inline',
      contentAlignX = 'left',
      contentAlignY = 'center',

      beforeContentDirection = 'inline',
      beforeContentAlignX = 'left',
      beforeContentAlignY = 'center',

      afterContentDirection = 'inline',
      afterContentAlignX = 'right',
      afterContentAlignY = 'center',

      ...props
    },
    ref
  ) => {
    const CHILDREN = children || label
    const shouldBeEmpty = EMPTY_ELEMENTS.includes(tag)
    const isSimple = !beforeContent && !afterContent

    const sharedProps = {
      ref: ref || innerRef,
      extendCss: css,
      tag,
      block,
      contentDirection,
      alignX: contentAlignX,
      alignY: contentAlignY
    }

    if (shouldBeEmpty) return <Wrapper {...sharedProps} {...props} />

    let SUB_TAG
    if (config.isWeb) {
      SUB_TAG = INLINE_ELEMENTS.includes(tag) ? 'span' : 'div'
    }

    const INJECTED_PROPS = pick(props, forwardProps)

    // --------------------------------------------------------
    // direction & alignX calculations
    // --------------------------------------------------------
    const wrapperAlignX = isSimple && contentAlignX ? contentAlignX : alignX
    const wrapperAlignY = isSimple && contentAlignY ? contentAlignY : alignY
    let wrapperDirection = isSimple && contentDirection ? contentDirection : 'inline'

    if (vertical) wrapperDirection = transformVerticalProp(vertical)

    return (
      <Wrapper
        {...sharedProps}
        contentDirection={wrapperDirection}
        alignX={wrapperAlignX}
        alignY={wrapperAlignY}
        {...props}
      >
        {beforeContent && (
          <Content
            tag={SUB_TAG}
            type="before"
            parentDirection={wrapperDirection}
            extendCss={beforeContentCss}
            contentDirection={beforeContentDirection}
            alignX={beforeContentAlignX}
            alignY={beforeContentAlignY}
            equalCols={equalCols}
            gap={gap}
          >
            {renderContent(beforeContent, INJECTED_PROPS)}
          </Content>
        )}

        {beforeContent || afterContent ? (
          <Content
            tag={SUB_TAG}
            type="content"
            parentDirection={wrapperDirection}
            extendCss={contentCss}
            contentDirection={contentDirection}
            alignX={contentAlignX}
            alignY={contentAlignY}
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
            type="after"
            parentDirection={wrapperDirection}
            extendCss={afterContentCss}
            contentDirection={afterContentDirection}
            alignX={afterContentAlignX}
            alignY={afterContentAlignY}
            equalCols={equalCols}
            gap={gap}
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
