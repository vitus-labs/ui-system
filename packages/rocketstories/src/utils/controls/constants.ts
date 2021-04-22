import { htmlTags } from '@vitus-labs/core'
import { CONTROL_TYPES } from '../../constants/controls'

const LABEL_SIMPLE = 'Simple Values'
const LABEL_OPTIONS = 'Options'

export const STORYBOOK_CONTROL_TYPES = CONTROL_TYPES

export const CONTROL_MAP = {
  tag: 'select',
} as const

export const CONTROL_OPTIONS = {
  tag: htmlTags,
} as const

export const CONTROL_TYPES_GROUPS = {
  text: LABEL_SIMPLE,
  number: LABEL_SIMPLE,
  color: LABEL_SIMPLE,
  range: LABEL_OPTIONS,
  object: LABEL_OPTIONS,
  array: LABEL_OPTIONS,
  select: LABEL_OPTIONS,
  'multi-select': LABEL_OPTIONS,
  radio: LABEL_OPTIONS,
  'inline-radio': LABEL_OPTIONS,
  check: LABEL_OPTIONS,
  'check-radio': LABEL_OPTIONS,
  tag: 'HTML Semantics',
  boolean: 'Booleans',
  dateTime: 'Date & Time',
  events: 'Events',
  data: 'Data',
} as const
