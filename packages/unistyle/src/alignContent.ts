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

const DIRECTION: DIRECTION_TYPE = __WEB__
  ? {
      inline: 'row',
      reverseInline: 'reverse-row',
      rows: 'column',
      reverseRows: 'reverse-column',
    }
  : {
      inline: 'row',
      reverseInline: 'row-reverse',
      rows: 'column',
      reverseRows: 'column-reverse',
    }

export type AlignContentDirection = keyof DIRECTION_TYPE
export type AlignContentAlignX = keyof typeof ALIGN_X
export type AlignContentAlignY = keyof typeof ALIGN_Y

export type AlignContentProps = ({
  direction,
  alignX,
  alignY,
}: {
  direction: AlignContentDirection
  alignX: AlignContentAlignX
  alignY: AlignContentAlignY
}) => ReturnType<typeof config.css>

const alignContent: AlignContentProps = (attrs) => {
  const { direction, alignX, alignY } = attrs

  if (isEmpty(attrs) || !direction || !alignX || !alignY) {
    return undefined
  }

  const isReverted = ['inline', 'reverseInline'].includes(direction)
  const dir = DIRECTION[direction]
  const x = ALIGN_X[alignX]
  const y = ALIGN_Y[alignY]

  return config.css`
    flex-direction: ${dir};
    align-items: ${isReverted ? y : x};
    justify-content: ${isReverted ? x : y};
  `
}

export default alignContent
