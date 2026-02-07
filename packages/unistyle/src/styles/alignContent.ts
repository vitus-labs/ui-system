import { config, isEmpty } from '@vitus-labs/core'

export type AlignContentDirectionKeys = keyof typeof ALIGN_CONTENT_DIRECTION
export type AlignContentAlignXKeys = keyof typeof ALIGN_CONTENT_MAP_X
export type AlignContentAlignYKeys = keyof typeof ALIGN_CONTENT_MAP_Y

const ALIGN_CONTENT_MAP_SHARED = {
  center: 'center',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  block: 'stretch',
}

export const ALIGN_CONTENT_MAP_X = {
  left: 'flex-start',
  right: 'flex-end',
  ...ALIGN_CONTENT_MAP_SHARED,
} as const

export const ALIGN_CONTENT_MAP_Y = {
  top: 'flex-start',
  bottom: 'flex-end',
  ...ALIGN_CONTENT_MAP_SHARED,
} as const

export const ALIGN_CONTENT_DIRECTION = __WEB__
  ? {
      inline: 'row',
      reverseInline: 'row-reverse',
      rows: 'column',
      reverseRows: 'column-reverse',
    }
  : {
      inline: 'row',
      reverseInline: 'row-reverse',
      rows: 'column',
      reverseRows: 'column-reverse',
    }

export type AlignContent = ({
  direction,
  alignX,
  alignY,
}: {
  direction: AlignContentDirectionKeys
  alignX: AlignContentAlignXKeys
  alignY: AlignContentAlignYKeys
}) => ReturnType<typeof config.css> | null

/**
 * Converts semantic direction/alignX/alignY values into `flex-direction`,
 * `align-items`, and `justify-content`. For inline directions (row) the
 * X/Y axes are swapped so that `alignX` always controls the horizontal axis.
 */
const alignContent: AlignContent = (attrs) => {
  const { direction, alignX, alignY } = attrs

  if (isEmpty(attrs) || !direction || !alignX || !alignY) {
    return null
  }

  const isReverted = ['inline', 'reverseInline'].includes(direction)
  const dir = ALIGN_CONTENT_DIRECTION[direction]
  const x = ALIGN_CONTENT_MAP_X[alignX]
  const y = ALIGN_CONTENT_MAP_Y[alignY]

  return config.css`
    flex-direction: ${dir};
    align-items: ${isReverted ? y : x};
    justify-content: ${isReverted ? x : y};
  `
}

export default alignContent
