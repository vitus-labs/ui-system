export const MODE_DEFAULT = 'light'

export const PSEUDO_KEYS = ['hover', 'active', 'focus', 'pressed'] as const

export const THEME_MODES = {
  light: true,
  dark: true,
} as const

export const THEME_MODES_INVERSED = {
  dark: 'light',
  light: 'dark',
} as const

export const CONFIG_KEYS = [
  'provider',
  'consumer',
  'DEBUG',
  'name',
  'component',
  'inversed',
  'passProps',
  'styled',
] as const

export const STYLING_KEYS = ['theme', 'styles'] as const
export const STATIC_KEYS = [...STYLING_KEYS, 'compose'] as const

export const ALL_RESERVED_KEYS = [
  ...Object.keys(THEME_MODES),
  ...CONFIG_KEYS,
  ...STATIC_KEYS,
  'attrs',
] as const
