const group = 'Rocketstyle (Vitus-Labs)'

export default {
  hover: {
    group,
    type: 'boolean',
    value: false,
    description:
      'Can be manually triggered **hover** event on the element. Behaves as **:hover** state in _CSS_.',
  },
  active: {
    group,
    type: 'boolean',
    value: false,
    description:
      'Can be manually triggered **active** event on the element. Can be used to define element as `active`, e.g. _links_.',
  },
  pressed: {
    group,
    type: 'boolean',
    value: false,
    description:
      'Can be manually triggered **pressed** event on the element. Behaves as `:active` state in _CSS_.',
  },
  focus: {
    group,
    type: 'boolean',
    value: false,
    description:
      'Can be manually triggered **focus** event on the element. Behaves as `:focus` state in _CSS_.',
  },
  onMouseEnter: {
    group,
    type: 'function',
    description:
      'The _onMouseEnter_ function can take a `SyntheticMouseEvent`.',
  },
  onMouseLeave: {
    group,
    type: 'function',
    description:
      'The _onMouseLeave_ function can take a `SyntheticMouseEvent.`',
  },
  onMouseDown: {
    group,
    type: 'function',
    description: 'The _onMouseDown_ function can take a `SyntheticMouseEvent`.',
  },
  onMouseUp: {
    group,
    type: 'function',
    description: 'The _onMouseUp_ function can take a `SyntheticMouseEvent`.',
  },
  onFocus: {
    group,
    type: 'function',
    description: 'The _onFocus_ function can take a `SyntheticFocusEvent`.',
  },
  onBlur: {
    group,
    type: 'function',
    description: 'The _onBlur_ function can take a `SyntheticFocusEvent`.',
  },
} as const
