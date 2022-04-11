const group = 'Rocketstyle (Vitus-Labs)'

export default {
  hover: {
    type: 'boolean',
    group,
    description:
      'Can be manually triggered **hover** event on the element. Behaves as **:hover** state in _CSS_.',
  },
  active: {
    type: 'boolean',
    group,
    description:
      'Can be manually triggered **active** event on the element. Can be used to define element as `active`, e.g. _links_.',
  },
  pressed: {
    type: 'boolean',
    group,
    description:
      'Can be manually triggered **pressed** event on the element. Behaves as `:active` state in _CSS_.',
  },
  focus: {
    type: 'boolean',
    group,
    description:
      'Can be manually triggered **focus** event on the element. Behaves as `:focus` state in _CSS_.',
  },
  onMouseEnter: {
    type: 'MouseEvent',
    group,
    description:
      'The _onMouseEnter_ function can take a `SyntheticMouseEvent`.',
  },
  onMouseLeave: {
    type: 'MouseEvent',
    group,
    description:
      'The _onMouseLeave_ function can take a `SyntheticMouseEvent.`',
  },
  onMouseDown: {
    type: 'MouseEvent',
    group,
    description: 'The _onMouseDown_ function can take a `SyntheticMouseEvent`.',
  },
  onMouseUp: {
    type: 'MouseEvent',
    group,
    description: 'The _onMouseUp_ function can take a `SyntheticMouseEvent`.',
  },
  onFocus: {
    type: 'FocusEvent',
    group,
    description: 'The _onFocus_ function can take a `SyntheticFocusEvent`.',
  },
  onBlur: {
    type: 'FocusEvent',
    group,
    description: 'The _onBlur_ function can take a `SyntheticFocusEvent`.',
  },
} as const
