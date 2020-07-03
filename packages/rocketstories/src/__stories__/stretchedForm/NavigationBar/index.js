import React from 'react'
import { element } from '../base'
// import { withEqualWidthBeforeAfter } from '@vitus-labs/elements'

const Wrapper = element
  .config({ name: 'base/layout/NavigationBar/Wrapper' })
  .attrs({
    tag: 'header',
    block: true
  })
  .theme({
    height: '60px',
    zIndex: 100
  })

const Inner = element
  .config({ name: 'base/layout/NavigationBar/Inner' })
  .attrs({ tag: 'div' })
  // .compose({
  //   withEqualWidthBeforeAfter
  // })
  .theme(t => ({
    fullScreen: true,
    bgColor: t.color.white,
    borderWidth: t.borderWidth.base,
    borderColor: t.color.gray200,
    height: 'inherit',
    paddingX: t.spacing.xl,
    paddingY: 0
  }))
  .styles(
    css => css`
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);

      &::before {
        content: '';
        display: block;
        position: absolute;
        height: 150px;
        width: 100%;
        background-color: #fff;
        bottom: 58px;
      }
    `
  )

export default props => (
  <Wrapper>
    <Inner {...props} />
  </Wrapper>
)
