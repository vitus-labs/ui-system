export const CONTROL_TYPES = [
  'tag',
  'text',
  'number',
  'range',
  'boolean',
  'color',
  'select',
  'multi-select',
  'object',
  'array',
  'radio',
  'inline-radio',
  'check',
  'inline-check',
  'function',
  'component',
] as const

export type T_CONTROL_TYPES = (typeof CONTROL_TYPES)[number]
