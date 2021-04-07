const CONTROL_TYPES = {
  values: 'Simple values',
  html: 'HTML Semantics',
  dimensions: 'Dimensions',
  pseudo: 'Pseudo',
  boolean: 'Booleans',
  options: 'Options',
  dateTime: 'Date & Time',
  events: 'Events',
  data: 'Data',
} as const

const CONTROLS_MAP = {
  boolean: () => ({
    control: { type: 'boolean' },
    table: {
      category: CONTROL_TYPES.boolean,
    },
  }),
  pseudo: () => ({
    control: { type: 'boolean' },
    table: {
      category: CONTROL_TYPES.pseudo,
    },
  }),
  pseudoAction: () => ({
    control: { type: 'action' },
    table: {
      category: CONTROL_TYPES.pseudo,
    },
  }),
  dimensionSelect: ({ options }) => ({
    control: { type: 'select', options },
    table: {
      category: CONTROL_TYPES.dimensions,
    },
  }),
  dimensionMultiSelect: ({ options }) => ({
    control: { type: 'multi-select', options },
    table: {
      category: CONTROL_TYPES.dimensions,
    },
  }),
  number: ({ options }) => ({
    control: { type: 'number', options },
    table: {
      category: CONTROL_TYPES.values,
    },
  }),
  range: () => ({}),
  object: ({ options }) => ({
    control: { type: 'object', options },
    table: {
      category: CONTROL_TYPES.data,
    },
  }),
  array: ({ options }) => ({
    control: { type: 'array', options },
    table: {
      category: CONTROL_TYPES.data,
    },
  }),
  radio: ({ options }) => ({
    control: { type: 'radio', options },
    table: {
      category: CONTROL_TYPES.options,
    },
  }),
  inlineRadio: ({ options }) => ({
    control: { type: 'inline-radio', options },
    table: {
      category: CONTROL_TYPES.options,
    },
  }),
  check: ({ options }) => ({
    control: { type: 'check', options },
    table: {
      category: CONTROL_TYPES.options,
    },
  }),
  inlineCheck: ({ options }) => ({
    control: { type: 'inline-check', options },
    table: {
      category: CONTROL_TYPES.options,
    },
  }),
  select: ({ options }) => ({
    control: { type: 'select', options },
    table: {
      category: CONTROL_TYPES.options,
    },
  }),
  tag: ({ options }) => ({
    control: { type: 'select', options },
    table: {
      category: CONTROL_TYPES.html,
      description: 'HTML Tag',
    },
  }),
  multiSelect: ({ options }) => ({
    control: { type: 'multi-select', options },
    table: {
      category: CONTROL_TYPES.options,
    },
  }),
  text: () => ({
    control: { type: 'text' },
    table: {
      category: CONTROL_TYPES.values,
    },
  }),
  color: () => ({
    control: { type: 'color' },
    table: {
      category: CONTROL_TYPES.values,
    },
  }),
  date: () => ({
    control: { type: 'date' },
    table: {
      category: CONTROL_TYPES.dateTime,
    },
  }),
} as const

export type ControlKeys = keyof typeof CONTROLS_MAP

export default CONTROLS_MAP
