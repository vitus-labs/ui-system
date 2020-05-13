//@ts-ignore
import { config } from '@vitus-labs/core'

const MAP_SHARED = {
  center: 'center',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  block: 'stretch',
}

const MAP_ALIGN_X = {
  left: 'flex-start',
  right: 'flex-end',
  ...MAP_SHARED,
}

const MAP_ALIGN_Y = {
  top: 'flex-start',
  bottom: 'flex-end',
  ...MAP_SHARED,
}

const MAP_DIRECTION = {
  web: {
    column: 'column',
    reverseColumn: 'reverse-column',
    rows: 'row',
    reverseRows: 'reverse-row',
  },
  native: {
    column: 'column',
    reverseColumn: 'column-reverse',
    rows: 'row',
    reverseRows: 'row-reverse',
  },
}

const alignValue = <T>(map: T) => (attr: keyof T) => map[attr]

const alignValueX = alignValue(MAP_ALIGN_X)
const alignValueY = alignValue(MAP_ALIGN_Y)
const setDirection = alignValue(MAP_DIRECTION[config.platform])

const alignContent = (attrs) => {
  if (
    !attrs ||
    typeof attrs !== 'object' ||
    !attrs.direction ||
    !attrs.alignX ||
    !attrs.alignY
  ) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`
        You are not passing an object with keys direction, alignX and alignY.
      `)
    }

    return []
  }

  const { direction, alignX, alignY } = attrs
  const styles = ({ direction, alignX, alignY }) => config.css`
    flex-direction: ${direction};
    align-items: ${alignX};
    justify-content: ${alignY};
  `

  const map = {
    rows: {
      direction: setDirection('column'),
      alignX: alignValueX(alignX),
      alignY: alignValueY(alignY),
    },
    reverseRows: {
      direction: setDirection('reverseColumn'),
      alignX: alignValueX(alignX),
      alignY: alignValueY(alignY),
    },
    inline: {
      direction: setDirection('rows'),
      alignX: alignValueY(alignY),
      alignY: alignValueX(alignX),
    },
    reverseInline: {
      direction: setDirection('reverseRows'),
      alignX: alignValueY(alignY),
      alignY: alignValueX(alignX),
    },
  }

  return styles(map[direction])
}

export default alignContent
