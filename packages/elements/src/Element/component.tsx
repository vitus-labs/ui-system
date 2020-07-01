import React, { forwardRef, ReactNode, Ref } from 'react'
import { config, renderContent } from '@vitus-labs/core'
import { Wrapper, Content } from '~/helpers'
import { INLINE_ELEMENTS, EMPTY_ELEMENTS } from './constants'
import { transformVerticalProp } from './utils'
import { AlignX, AlignY, Direction, Booltype } from '~/types'

// type Reference = HTMLElement

type ResponsiveBoolean = boolean | Array<Booltype> | Record<string, boolean>
type Responsive =
  | number
  | Array<string | number>
  | Record<string, number | string>

type Props = Partial<{
  tag: import('styled-components').StyledComponentPropsWithRef<any>
  innerRef: any
  label: ReactNode
  children: ReactNode
  content: ReactNode
  beforeContent: ReactNode
  afterContent: ReactNode
  block: ResponsiveBoolean
  equalCols: ResponsiveBoolean
  gap: Responsive
  vertical: ResponsiveBoolean
  alignX: AlignX
  contentAlignX: AlignX
  beforeContentAlignX: AlignX
  afterContentAlignX: AlignX
  alignY: AlignY
  contentAlignY: AlignY
  beforeContentAlignY: AlignY
  afterContentAlignY: AlignY
  contentDirection: Direction
  beforeContentDirection: Direction
  afterContentDirection: Direction
  dangerouslySetInnerHTML: any
  css: any
  contentCss: any
  beforeContentCss: any
  afterContentCss: any
}>

const Element = forwardRef<any, Props>(
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
    const shouldBeEmpty =
      props.dangerouslySetInnerHTML || EMPTY_ELEMENTS.includes(tag)

    const sharedProps = {
      ref: ref || innerRef,
      extendCss: css,
      tag,
      block,
      contentDirection,
      alignX: contentAlignX,
      alignY: contentAlignY,
    }

    if (shouldBeEmpty) return <Wrapper {...sharedProps} {...props} />

    let SUB_TAG
    if (config.isWeb) {
      SUB_TAG = INLINE_ELEMENTS.includes(tag) ? 'span' : 'div'
    }
    const isSimple = !beforeContent && !afterContent
    const CHILDREN = children || content || label

    // --------------------------------------------------------
    // direction & alignX calculations
    // --------------------------------------------------------
    const wrapperAlignX = isSimple && contentAlignX ? contentAlignX : alignX
    const wrapperAlignY = isSimple && contentAlignY ? contentAlignY : alignY
    let wrapperDirection =
      isSimple && contentDirection ? contentDirection : 'inline'

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
            contentType="before"
            parentDirection={wrapperDirection}
            extendCss={beforeContentCss}
            contentDirection={beforeContentDirection}
            alignX={beforeContentAlignX}
            alignY={beforeContentAlignY}
            equalCols={equalCols}
            gap={gap}
            data-element="before"
          >
            {renderContent(beforeContent)}
          </Content>
        )}

        {beforeContent || afterContent ? (
          <Content
            tag={SUB_TAG}
            contentType="content"
            parentDirection={wrapperDirection}
            extendCss={contentCss}
            contentDirection={contentDirection}
            alignX={contentAlignX}
            alignY={contentAlignY}
            equalCols={equalCols}
            isContent
            data-element="content"
          >
            {renderContent(CHILDREN)}
          </Content>
        ) : (
          renderContent(CHILDREN)
        )}

        {afterContent && (
          <Content
            tag={SUB_TAG}
            contentType="after"
            parentDirection={wrapperDirection}
            extendCss={afterContentCss}
            contentDirection={afterContentDirection}
            alignX={afterContentAlignX}
            alignY={afterContentAlignY}
            equalCols={equalCols}
            gap={gap}
            data-element="after"
          >
            {renderContent(afterContent)}
          </Content>
        )}
      </Wrapper>
    )
  }
)

Element.displayName = 'vitus-labs/elements/Element'

export default Element
