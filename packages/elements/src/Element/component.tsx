import { render } from '@vitus-labs/core'
import { forwardRef, useMemo } from 'react'
import { PKG_NAME } from '~/constants'
import { Content, Wrapper } from '~/helpers'
import type { VLElement } from './types'
import { getShouldBeEmpty, isInlineElement } from './utils'

const defaultDirection = 'inline'
const defaultContentDirection = 'rows'
const defaultAlignX = 'left'
const defaultAlignY = 'center'

const Component: VLElement = forwardRef(
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

      direction,
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
    ref,
  ) => {
    // --------------------------------------------------------
    // check if should render only single element
    // --------------------------------------------------------
    const shouldBeEmpty = __WEB__
      ? !!props.dangerouslySetInnerHTML || getShouldBeEmpty(tag)
      : false

    // --------------------------------------------------------
    // if not single element, calculate values
    // --------------------------------------------------------
    const isSimpleElement = !beforeContent && !afterContent
    const CHILDREN = children ?? content ?? label

    const isInline = __WEB__ ? isInlineElement(tag) : false
    const SUB_TAG = __WEB__ && isInline ? 'span' : undefined

    // --------------------------------------------------------
    // direction & alignX & alignY calculations
    // --------------------------------------------------------
    const { wrapperDirection, wrapperAlignX, wrapperAlignY } = useMemo(() => {
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

    // --------------------------------------------------------
    // common wrapper props
    // --------------------------------------------------------
    const WRAPPER_PROPS = {
      ref: ref ?? innerRef,
      extendCss: css,
      tag,
      block,
      direction: wrapperDirection,
      alignX: wrapperAlignX,
      alignY: wrapperAlignY,
      as: undefined, // reset styled-components `as` prop
    }

    // --------------------------------------------------------
    // return simple/empty element like input or image etc.
    // --------------------------------------------------------
    if (shouldBeEmpty) {
      return <Wrapper {...props} {...WRAPPER_PROPS} />
    }

    const contentRenderOutput = render(CHILDREN)

    return (
      <Wrapper {...props} {...WRAPPER_PROPS} isInline={isInline}>
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
            {render(beforeContent)}
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
            {render(afterContent)}
          </Content>
        )}
      </Wrapper>
    )
  },
)

const name = `${PKG_NAME}/Element` as const

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
