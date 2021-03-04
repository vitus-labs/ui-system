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
] as const

export const STYLING_KEYS = ['theme', 'attrs', 'styles'] as const
export const STATIC_KEYS = [...STYLING_KEYS, 'compose'] as const
