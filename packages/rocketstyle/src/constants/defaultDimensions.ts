const DEFAULT_DIMENSIONS = {
  states: 'state',
  sizes: 'size',
  variants: 'variant',
  multiple: {
    propName: 'multiple',
    multi: true,
  },
} as const

export type DefaultDimensions = typeof DEFAULT_DIMENSIONS

export default DEFAULT_DIMENSIONS
