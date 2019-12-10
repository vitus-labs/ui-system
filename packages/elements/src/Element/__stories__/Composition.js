import rocketstyle from '@vitus-labs/rocketstyle'
import Element from '~/Element'

const element = rocketstyle()({ component: Element, name: 'base' }).styles(
  css => css`
    ${({ rocketstyle: t }) => css`
      background-color: ${t.bgColor};
    `}
  `
)

export const Container = element
  .config({
    name: 'base/Container'
  })
  .attrs({
    block: true,
    contentDirection: 'rows'
  })
  .theme({ bgColor: 'papayawhip' })
  .styles(
    css => css`
      padding: 20px;
      min-height: 100px;
    `
  )

export const Inner = element
  .config({
    name: 'base/Inner'
  })
  .theme({
    bgColor: 'blue'
  })
