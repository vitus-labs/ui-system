export const RESERVED_OR_KEYS = [
  'provider',
  'consumer',
  'DEBUG',
  'name',
  'component',
  'inversed',
  'passProps',
] as const

export const RESERVED_CLONED_KEYS = ['theme', 'attrs', 'styles'] as const
export const RESERVED_STATIC_KEYS = [
  ...RESERVED_CLONED_KEYS,
  'compose',
] as const
