import { config, isEmpty } from '@vitus-labs/core'

const MAP_SHARED = {
  center: 'center',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  block: 'stretch',
}

const ALIGN_X = {
  left: 'flex-start',
  right: 'flex-end',
  ...MAP_SHARED,
}

const ALIGN_Y = {
  top: 'flex-start',
  bottom: 'flex-end',
  ...MAP_SHARED,
}

type DIRECTION_TYPE = {
  inline: string
  reverseInline: string
  rows: string
  reverseRows: string
}

const DIRECTION: DIRECTION_TYPE = __NATIVE__
  ? {
      inline: 'row',
      reverseInline: 'row-reverse',
      rows: 'column',
      reverseRows: 'column-reverse',
    }
  : {
      inline: 'row',
      reverseInline: 'reverse-row',
      rows: 'column',
      reverseRows: 'reverse-column',
    }

export type AlignContentProps = ({
  direction,
  alignX,
  alignY,
}: {
  direction: keyof DIRECTION_TYPE
  alignX: keyof typeof ALIGN_X
  alignY: keyof typeof ALIGN_Y
}) => ReturnType<typeof config.css>

const alignContent: AlignContentProps = (attrs) => {
  const { direction, alignX, alignY } = attrs

  if (isEmpty(attrs) || !direction || !alignX || !alignY) {
    return undefined
  }

  const isReverted = ['inline', 'inlineReverse'].includes(direction)
  const dir = DIRECTION[direction]
  const aX = ALIGN_X[alignX]
  const aY = ALIGN_Y[alignY]

  return config.css`
    flex-direction: ${dir};
    align-items: ${isReverted ? aY : aX};
    justify-content: ${isReverted ? aX : aY};
  `
}

export default alignContent
